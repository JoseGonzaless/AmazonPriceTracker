// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

console.log("Hello from Functions!");

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  const reqJson = await req.json();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { global: { headers: { Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}` } } }
  );

  // Save all products
  const products = reqJson.map((scrapedProduct) => ({
    asin: scrapedProduct.asin,
    updated_at: new Date().toISOString(),
    name: scrapedProduct.name,
    image: scrapedProduct.image,
    url: scrapedProduct.url,
    final_price: scrapedProduct.final_price,
    currency: scrapedProduct.currency,
  }));

  const { error: productsError } = await supabase
    .from("products")
    .upsert(products);
  console.log(productsError);

  // Link products with search ID
  const productSearchLinks = products.map((scrapedProduct) => ({
    asin: scrapedProduct.asin,
    search_id: id,
  }));

  // Insert extra links when a product is updated
  const { error: productSearchError } = await supabase
    .from("product_search")
    .upsert(productSearchLinks);
  console.log(productSearchError);

  // Update search status
  const { error: searchesError } = await supabase
    .from("searches")
    .update({
      status: "Done",
      last_scraped: new Date().toISOString(),
    })
    .eq("id", id);
  console.log(searchesError);

  const data = {
    message: "Hello!",
  };

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } }
  );
});

/* To invoke locally:

  1. Run supabase start (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/scrape-complete' \
    --header 'Authorization: Bearer <YOUR_API_TOKEN>' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'
*/
