# Accommodation Recommendation Engine: Simple Viva Guide

## 1. What is this system?
This is a smart tool that helps tourists find the best place to stay in Sri Lanka. Instead of just showing a long list of hotels, it "thinks" like a travel agent by looking at what the tourist likes and what they can afford.

---

## 2. How does it work? (The 2-Step Process)

To make it fast and accurate, we use two steps:

### Step 1: The "Must-Have" Filter
First, we throw away any options that definitely won't work.
*   **Availability**: Is it actually open?
*   **Budget**: Does its price overlap with what the user wants to pay?
*   **Group Size**: Can it fit everyone in the group?
*   **District**: If they only want one specific city, we filter for that.

### Step 2: The "Best Match" Ranking
Now that we have a few good options, we rank them from 1 to 10. We give each option a "score" based on how well it fits the user's personality.

---

## 3. How do we calculate the "Score"?

We look at several things and give them points:

*   **Matching Interests**: If the user likes "beaches" and the hotel is a "beach resort," it gets more points.
*   **Location**: Exact city matches get full points. If it's in the same province but a different city, it still gets some points.
*   **Popularity**: We look at how many people booked it before. But we don't let famous hotels win every time – we give new, high-quality places a fair chance too.
*   **Standard Rating**: Better star ratings mean more points.

### 💡 Deep Dive: How do we match "Interests"? (Jaccard Similarity)
In your Viva, you might be asked how the "Matching Interests" part works. We use a formula called **Jaccard Similarity**.

**Think of it like this:**
*   You have a list of things you want (e.g., *Beach, Pool*).
*   The hotel has a list of things it offers (e.g., *Beach, Wifi, Gym*).
*   **Jaccard Similarity** looks at:
    1.  What's in **BOTH** lists? (e.g., *Beach*)
    2.  What's in **EITHER** list? (e.g., *Beach, Pool, Wifi, Gym*)
    3.  **Score** = (Common Items) ÷ (Total Unique Items) = **1 ÷ 4 = 0.25**

It's a very famous and fair way to calculate matches!

---

## 4. Smart Improvements We Added

### 🚀 Travel Style (Smart Weights)
The system changes its priorities based on the traveler's style:
*   **Luxury Travelers**: Points are mostly given for high ratings and extra amenities (like pools/spas).
*   **Budget Travelers**: Points are mostly given for the best price.

### 💰 The "Budget Bonus"
For budget travelers, if we find a place that is even cheaper than the middle of their budget, we give it a **Bonus Score**. This helps highlight the best deals.

---

## 5. Where does the data come from?
1.  **Real Data**: We pull real information from our main database.
2.  **Backup Data**: If we don't have enough real hotels in a specific area yet, the system automatically brings in "mock data" so the user never sees an empty screen.

---

## 6. Simple Viva Questions & Answers

**Q: Why show hotels that are slightly more expensive than the budget?**
*A: Because a hotel's price can change. If a hotel usually costs 12,000 but the user's budget is 10,000, they might still want to see it in case there's a discount or a cheaper room type available.*

**Q: What happens if a hotel has no ratings yet?**
*A: We give it a "middle score" (0.5). This is fair—it's better than giving it a zero and hiding it, but not as good as a hotel that has proven it's great.*

**Q: What is Jaccard Similarity in simple terms?**
*A: It's the "Intersection over Union." Basically, it's a score from 0 to 1 that shows how much two lists overlap. 1 means perfect match, 0 means no match.*

**Q: Does it get slow if there are thousands of hotels?**
*A: No, because Step 1 (Filtering) is done very quickly by the database itself. Step 2 (Ranking) only happens for the small number of hotels that passed the first step.*

---

## 7. Guide Recommendation Engine (New!)

While similar to accommodations, the Guide Recommender uses a **Point-Additive System** focused on professional expertise.

### 🏆 Key Point Components
*   **Experience Scoring**: The system automatically reads the guide's history (e.g., "5 years in Hiking") and gives more points for higher experience (up to 5 points).
*   **Language Match**: Points are given for every language match, ensuring the traveler can communicate easily.
*   **Precision Pricing**: Instead of a simple pass/fail, we give more points to guides who are priced lower in the user's budget range.

### 🧪 Advanced Logic: String Parsing
We use **Regex (Regular Expressions)** to find years of experience inside simple text descriptions. This allows us to turn a sentence like *"I have 12 years of experience in wildlife"* into a numerical score without changing the database structure!

---
*Prepared for Viva - January 2026*
