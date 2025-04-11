const express = require('express');
const axios = require('axios');
const faiss = require('faiss-node');
const fs = require('fs/promises');
const { pipeline } = require('@huggingface/transformers');
const path = require('path');

const router = express.Router();


// Global Variables
let knowledgeBase = null;
let index = null;
let embedder = null;


// Load knowledge base from JSON
async function loadKnowledgeBase() {
// Load and encode knowledge base
try {
  // Read and parse JSON file
  const filePath = path.join(__dirname, '..', 'data', 'knowledge_base.json');
  const data = await fs.readFile(filePath, 'utf-8');
  knowledgeBase = JSON.parse(data);
  
  // Encode each dialogue text
  const embeddings = [];
  for (const query of knowledgeBase.queries) {
      const embedding = await embedder(query, { 
          pooling: 'mean', 
          normalize: true 
      });
      embeddings.push(Array.from(embedding.data));
  }
  
  // Convert embeddings to the format FAISS expects
  const dimension = embeddings[0].length; // Get embedding dimension
  console.log(dimension);
  // Create and populate FAISS index
  index =new faiss.IndexFlatIP(dimension);
  for(const embed of embeddings){
    index.add(embed);
  }
  //index.add(embeddings);
  
  console.log('Knowledge base encoded and indexed successfully');
} catch (error) {
  console.error('Error processing knowledge base:', error);
  throw new Error('Failed to process knowledge base');
}
}


// Initialize AI models
async function loadModels() {
    try {
        embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        console.log("fetched sentence transformer");
    } catch (error) {
        console.error('Error loading AI models:', error);
        process.exit(1);
    }
}
// Retrieval of relevant documents
async function retrieveDocs(query, top_k = 3) {
    try {
        const output = await embedder(query, { pooling: 'mean', normalize: true });
        console.log(output);
        const queryEmbedding = Array.from(output.data);
        console.log(queryEmbedding);
        const searchResults = await index.search(queryEmbedding, top_k);
        console.log(searchResults);
        return searchResults.labels.map(idx => knowledgeBase.queries[idx] || "No relevant data found.");
    } catch (error) {
        console.error('Error retrieving documents:', error);
        return [];
    }
}


async function generateResponse(query) {
  try {
      const retrievedDocs = await retrieveDocs(query);
      const context = retrievedDocs.length > 0 ? retrievedDocs.join("\n") : "No relevant data found.";  
      console.log("Context for AI:", context);

      const prompt = {
        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: `
    ### Context:
    ${context}
    
    ### Question:
    ${query}
    
    ### Instructions for AI:
    (Dont return a very long answer)
    Suppose you are a support staff of tokenflow, here is a brief overview of tokenflow: Buy and sell unused tokens at minimal cost. Get access to premium content without breaking the bank. Our marketplace connects token holders with content seekers for a win-win exchange.
    . 
    Please provide a clear, beginner-friendly explanation in simple terms. Use the following structure in your response (do not mention anything mentioned in the instruction to the users):
    
    1. **Why:** Tell the user about his/her issue
    2. **Step-to-Procees:** Break down the answer into clear, numbered steps or bullet points.
    3. **Contact Us:** End with any helpful tips or follow-up actions the user can take.
    
    Avoid using complex technical jargon unless absolutely necessary. Use a friendly and helpful tone throughout. Use the context to the fullest. Don't answer questions which are not related to the platform or are unethical, reply those with, 'I dont know' or something.`
                    }
                ]
            }
        ]
    };
    

      const apiKey = process.env.GEMINI_API_KEY||'AIzaSyBcQetbwsVQppjmYfEKShraZhfY0zmo2'; // Replace with your actual key
      const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-exp-03-25:generateContent?key=${apiKey}`,
    prompt,
    { headers: { "Content-Type": "application/json" } }
    );

      // Extract response properly
      const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 
                         "Oops! I couldn't generate a response. Try again!";
      
      console.log("AI Response:", aiResponse);
      console.log("remember our chat-- User:"+query+"\nMarin:"+aiResponse+"Next time if i ask anything related to this, please respond accoding to this chat.");
      knowledgeBase.queries.push("remember our chat-- User:"+query+"\nMarin:"+aiResponse);
      const output = await embedder("remember our chat-- User:"+query+"\nMarin:"+aiResponse, { pooling: 'mean', normalize: true });
      const queryEmbedding = Array.from(output.data);
      index.add(queryEmbedding);
      console.log("recorded data");
      return aiResponse;

  } catch (error) {
      console.error("Error in AI response generation:", error?.response?.data || error);
      return "Oops! Sorry I forgot what you asked. Can you repeat?";
  }
}

// API Endpoint for Text Response
router.post('/ask', async (req, res) => {
    const query = req.body.text;
    if (!query) return res.status(400).json({ error: "Query is required" });

    const response = await generateResponse(query);
    res.json({ response });
});


(async () => {
  await loadModels();
  await loadKnowledgeBase();
})();

module.exports = router;
