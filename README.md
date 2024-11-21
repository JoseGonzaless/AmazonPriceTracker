# **Amazon Price Tracker App**

A React Native application for tracking and monitoring product prices on Amazon. This app helps users avoid the hassle of manually checking prices by providing real-time updates, historical price data, and notifications for price drops.

## **Features**
- Search and Display Products: Search for products on Amazon using keywords and display search results within the app.
- Track Price Changes: Monitor selected items, and automatically track their prices over time.
- Price History Visualization: View price changes in a graph to understand trends and timing.
- Notifications: Receive alerts when a tracked item's price drops.
- Data Scraping: Use BrightData's Web Scraper API to fetch Amazon price data reliably, overcoming captchas and IP bans.

## **Tech Stack**
- Frontend: React Native with Expo
- Backend: Supabase (authentication, real-time database, and storage)
- Web Scraping: BrightData Web Scraper API

## **Installation**  
#### Prerequisites
1. Node.js (https://nodejs.org)
2. Expo CLI (https://expo.dev)
3. Supabase Account (https://supabase.com)
4. BrightData Account with API setup (https://brightdata.com)

#### Steps
1. Clone the repository:  
git clone https://github.com/yourusername/amazon-price-tracker.git  
cd amazon-price-tracker

2. Install dependencies:  
npm install

3. Set up environment variables:  
Create a .env file in the project root with the following variables:  
SUPABASE_URL=your-supabase-url  
SUPABASE_ANON_KEY=your-supabase-anon-key  
BRIGHTDATA_API_KEY=your-brightdata-api-key  

4. Start the development server:  
expo start

5. Scan the QR code displayed in your terminal or browser with the Expo Go app on your mobile device to preview the app.

## **Usage**
1. Sign Up/In: Create an account or log in using Supabase authentication.
2. Search for Products: Enter keywords to search for products on Amazon.
3. Track Prices: Select products to track their price over time.
4. Notifications: Get notified when prices drop for tracked items.
5. View Price History: Analyze historical price data through interactive graphs.

## **License**   
This project is licensed under the MIT License. See the LICENSE file for details.

## **Acknowledgements**
- BrightData for providing the Web Scraper API.  
- Supabase for backend services and real-time database features.  
- The tutorial series that inspired this project.
