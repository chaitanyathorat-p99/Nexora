import os
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def generate_response(query, context_chunks):
    """
    Generates an answer to the query using Groq LLM based on the provided context.
    """
    try:
        # Load GROQ_API_KEY from environment variable
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY environment variable is not set.")
            
        # Initialize Groq client
        client = Groq(api_key=api_key)
        
        # Join the context_chunks list into a single string separated by "---"
        context_text = "\n---\n".join(context_chunks)
        
        # Construct the prompt
        prompt = f"""Answer the question based ONLY on the context below.
If the answer is not in the context, say: I could not find this in the document.

CRITICAL INSTRUCTIONS FOR DIAGRAMS:
If any part of the context includes a diagram description (which looks like [DIAGRAM_REF: path] followed by a description), you MUST:
1. Explain in detail what the diagram shows based on its description.
2. ALWAYS include the exact [DIAGRAM_REF: path] tag at the very end of your response. This is mandatory so the system can show the image to the user.

Context:
{context_text}

Question: {query}
Answer:"""

        # Send the prompt to Groq using the specified model and parameters
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.1-8b-instant",
            temperature=0.2,
            max_tokens=1024,
        )
        
        # Return the response text
        return chat_completion.choices[0].message.content
        
    except Exception as e:
        print(f"Error generating LLM response: {e}")
        return "I encountered an error while trying to generate a response."
