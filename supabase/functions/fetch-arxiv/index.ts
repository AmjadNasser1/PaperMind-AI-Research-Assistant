import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ArxivResult {
  id: string;
  title: string;
  summary: string;
  authors: string[];
  published: string;
  link: string;
  domain: string;
}

async function fetchArxivPapers(query: string, maxResults: number): Promise<ArxivResult[]> {
  const searchQuery = encodeURIComponent(query);
  const url = `http://export.arxiv.org/api/query?search_query=all:${searchQuery}&start=0&max_results=${maxResults}&sortBy=relevance&sortOrder=descending`;
  
  console.log(`Fetching from ArXiv: ${query}`);
  
  const response = await fetch(url);
  const xmlText = await response.text();
  
  // Parse XML response
  const entries: ArxivResult[] = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;
  
  while ((match = entryRegex.exec(xmlText)) !== null) {
    const entry = match[1];
    
    const idMatch = /<id>(.*?)<\/id>/.exec(entry);
    const titleMatch = /<title>([\s\S]*?)<\/title>/.exec(entry);
    const summaryMatch = /<summary>([\s\S]*?)<\/summary>/.exec(entry);
    const publishedMatch = /<published>(.*?)<\/published>/.exec(entry);
    
    // Extract authors
    const authors: string[] = [];
    const authorRegex = /<author>[\s\S]*?<name>(.*?)<\/name>[\s\S]*?<\/author>/g;
    let authorMatch;
    while ((authorMatch = authorRegex.exec(entry)) !== null) {
      authors.push(authorMatch[1].trim());
    }
    
    if (titleMatch && summaryMatch) {
      entries.push({
        id: idMatch ? idMatch[1].trim() : "",
        title: titleMatch[1].trim().replace(/\s+/g, " "),
        summary: summaryMatch[1].trim().replace(/\s+/g, " "),
        authors,
        published: publishedMatch ? publishedMatch[1].trim() : "",
        link: idMatch ? idMatch[1].trim() : "",
        domain: query,
      });
    }
  }
  
  return entries;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { domains, maxResultsPerDomain = 20 } = await req.json();
    
    const defaultDomains = [
      "computer vision machine learning",
      "natural language processing",
      "bioinformatics",
      "robotics",
      "cybersecurity",
      "climate modeling machine learning"
    ];
    
    const searchDomains = domains || defaultDomains;
    
    console.log(`Fetching papers from ${searchDomains.length} domains`);
    
    // Fetch papers from all domains
    const allPapers: ArxivResult[] = [];
    for (const domain of searchDomains) {
      try {
        const papers = await fetchArxivPapers(domain, maxResultsPerDomain);
        allPapers.push(...papers);
        console.log(`Fetched ${papers.length} papers for domain: ${domain}`);
      } catch (error) {
        console.error(`Error fetching domain ${domain}:`, error);
      }
    }
    
    console.log(`Total papers fetched: ${allPapers.length}`);
    
    return new Response(
      JSON.stringify({ papers: allPapers, count: allPapers.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in fetch-arxiv function:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
