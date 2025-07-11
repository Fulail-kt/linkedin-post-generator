class CompanyInput {
    companyDescription string @description("A description of the company")
    targetAudience string @description("The target audience for the LinkedIn post")
    companyName string @description("The name of the company")
    whatWeOffer string @description("What the company offers to the target audience")
}

class LinkedInPostResponse {
  hook string @description("A short, attention-grabbing hook line")
  content string @description("The main content of the LinkedIn post")
}


function GeneratePost(input: CompanyInput) -> LinkedInPostResponse {
  client "openai/gpt-4o-mini"
 prompt #"
        You are a LinkedIn content expert who creates viral, engaging posts that drive meaningful engagement and connections.
        
        Create a compelling LinkedIn post for {{input.companyName}} that follows this structure:
        
        **HOOK (First 1-2 lines):**
        - Start with a thought-provoking question, surprising statistic, or bold statement
        - Use curiosity gaps or contrarian takes
        - Keep it under 125 characters to avoid truncation
        - Examples: "Most companies are solving the wrong problem..." or "Here's what nobody tells you about [industry]..."
        
        **CONTENT BODY:**
        - Tell a story or share insights related to {{input.companyDescription}}
        - Include 2-3 key value points about {{input.whatWeOffer}}
        - Use short paragraphs (1-2 sentences max)
        - Add line breaks for readability
        - Include relevant pain points your target audience faces
        
        **CALL TO ACTION:**
        - End with a clear, specific question to drive comments
        - Relate directly to {{input.targetAudience}} interests
        - Avoid generic "What do you think?" questions
        
        **FORMATTING REQUIREMENTS:**
        - Use emojis strategically (1-3 max)
        - Include 3-5 relevant hashtags at the end
        - Keep total post under 1,300 characters
        - Use "See more" breaks effectively (around 210 characters)
        
        **TONE & VOICE:**
        - Professional yet conversational
        - Confident but not boastful
        - Focus on value and insights, not just promotion
        - Speak directly to {{input.targetAudience}}
        
        **CONTEXT:**
        Company: {{input.companyName}}
        Description: {{input.companyDescription}}
        Target Audience: {{input.targetAudience}}
        What We Offer: {{input.whatWeOffer}}
        
        Create a post that positions the company as a thought leader while subtly showcasing their expertise and offerings. The post should feel authentic and valuable, not like a sales pitch.

      {{ctx.output_format}}
        "#
  
  }


  test TestName {
  functions [GeneratePost]
  args {
    input {
      companyDescription "We are a company that helps founders automate their workflow with no-code tools."
      targetAudience "Founders"
      companyName "No-Code Tools"
      whatWeOffer "We help founders automate their workflow with no-code tools."
    }
  }
}
