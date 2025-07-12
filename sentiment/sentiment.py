"""
Social Media Sentiment Analysis Pipeline
========================================

This script demonstrates a complete pipeline for scraping social media data
and analyzing sentiment using LLM integration. Built for portfolio demonstration
and real-world social media monitoring applications.

Author: Jason Avina
Purpose: Automated social media sentiment analysis for business intelligence
"""

import praw
import openai
import pandas as pd
import json
import time
from datetime import datetime, timedelta
from typing import List, Dict, Any
import logging
from dataclasses import dataclass
import os
from collections import Counter
import re

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class SentimentResult:
    """Data class for storing sentiment analysis results"""
    text: str
    sentiment: str
    confidence: float
    themes: List[str]
    timestamp: datetime

class RedditScraper:
    """Handles Reddit API integration and data extraction"""
    
    def __init__(self, client_id: str, client_secret: str, user_agent: str):
        """Initialize Reddit API connection"""
        self.reddit = praw.Reddit(
            client_id=client_id,
            client_secret=client_secret,
            user_agent=user_agent
        )
        logger.info("Reddit API connection established")
    
    def scrape_posts(self, keywords: str, subreddit: str = "technology", 
                    limit: int = 100, time_filter: str = "week") -> List[Dict[str, Any]]:
        """
        Scrape Reddit posts based on keywords
        
        Args:
            keywords: Search terms for posts
            subreddit: Target subreddit (default: technology)
            limit: Maximum number of posts to scrape
            time_filter: Time range (hour, day, week, month, year)
            
        Returns:
            List of post dictionaries with metadata
        """
        try:
            posts = []
            subreddit_obj = self.reddit.subreddit(subreddit)
            
            # Search for posts containing keywords
            search_results = subreddit_obj.search(
                keywords, 
                sort="relevance", 
                time_filter=time_filter,
                limit=limit
            )
            
            for post in search_results:
                # Extract post data
                post_data = {
                    'id': post.id,
                    'title': post.title,
                    'text': post.selftext,
                    'score': post.score,
                    'num_comments': post.num_comments,
                    'created_utc': datetime.fromtimestamp(post.created_utc),
                    'url': post.url,
                    'subreddit': str(post.subreddit),
                    'author': str(post.author) if post.author else 'deleted'
                }
                
                # Get top comments
                post.comments.replace_more(limit=0)
                comments = []
                for comment in post.comments.list()[:5]:  # Top 5 comments
                    if hasattr(comment, 'body') and len(comment.body) > 20:
                        comments.append({
                            'text': comment.body,
                            'score': comment.score,
                            'created_utc': datetime.fromtimestamp(comment.created_utc)
                        })
                
                post_data['comments'] = comments
                posts.append(post_data)
                
                # Rate limiting
                time.sleep(0.1)
            
            logger.info(f"Successfully scraped {len(posts)} posts from r/{subreddit}")
            return posts
            
        except Exception as e:
            logger.error(f"Error scraping Reddit: {str(e)}")
            return []

class SentimentAnalyzer:
    """Handles LLM-powered sentiment analysis using OpenAI API"""
    
    def __init__(self, api_key: str):
        """Initialize OpenAI API connection"""
        openai.api_key = api_key
        self.client = openai.OpenAI(api_key=api_key)
        logger.info("OpenAI API connection established")
    
    def analyze_sentiment(self, text: str) -> Dict[str, Any]:
        """
        Analyze sentiment of text using GPT
        
        Args:
            text: Text to analyze
            
        Returns:
            Dictionary with sentiment, confidence, and themes
        """
        try:
            # Prepare prompt for sentiment analysis
            prompt = f"""
            Analyze the sentiment of this social media post and provide insights:
            
            Text: "{text}"
            
            Please provide your analysis in this exact JSON format:
            {{
                "sentiment": "positive/negative/neutral",
                "confidence": 0.85,
                "primary_emotion": "excitement/concern/curiosity/etc",
                "key_themes": ["theme1", "theme2", "theme3"],
                "reasoning": "Brief explanation of the sentiment assessment"
            }}
            
            Consider context, tone, and implied meaning. Be objective and accurate.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert sentiment analyst. Provide accurate, objective analysis of social media content."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=300,
                temperature=0.3
            )
            
            # Parse JSON response
            response_text = response.choices[0].message.content.strip()
            
            # Extract JSON from response (handle cases where GPT adds extra text)
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            json_str = response_text[json_start:json_end]
            
            result = json.loads(json_str)
            
            # Add timestamp
            result['analyzed_at'] = datetime.now().isoformat()
            
            return result
            
        except Exception as e:
            logger.error(f"Error analyzing sentiment: {str(e)}")
            # Return default neutral sentiment if analysis fails
            return {
                "sentiment": "neutral",
                "confidence": 0.5,
                "primary_emotion": "uncertain",
                "key_themes": ["analysis_failed"],
                "reasoning": f"Analysis failed: {str(e)}",
                "analyzed_at": datetime.now().isoformat()
            }
    
    def batch_analyze(self, texts: List[str], delay: float = 1.0) -> List[Dict[str, Any]]:
        """
        Analyze sentiment for multiple texts with rate limiting
        
        Args:
            texts: List of texts to analyze
            delay: Delay between API calls to respect rate limits
            
        Returns:
            List of sentiment analysis results
        """
        results = []
        
        for i, text in enumerate(texts):
            logger.info(f"Analyzing text {i+1}/{len(texts)}")
            
            # Clean text
            cleaned_text = self.clean_text(text)
            if len(cleaned_text) < 10:  # Skip very short texts
                continue
                
            result = self.analyze_sentiment(cleaned_text)
            result['original_text'] = text
            results.append(result)
            
            # Rate limiting
            time.sleep(delay)
        
        return results
    
    def clean_text(self, text: str) -> str:
        """Clean and preprocess text for analysis"""
        # Remove URLs
        text = re.sub(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', '', text)
        
        # Remove excessive whitespace
        text = ' '.join(text.split())
        
        # Remove very long texts (truncate to 500 chars for API efficiency)
        if len(text) > 500:
            text = text[:497] + "..."
        
        return text.strip()

class SentimentReporter:
    """Generates reports and visualizations from sentiment analysis results"""
    
    def __init__(self, results: List[Dict[str, Any]]):
        """Initialize with analysis results"""
        self.results = results
        self.df = pd.DataFrame(results)
    
    def generate_summary(self) -> Dict[str, Any]:
        """Generate high-level summary statistics"""
        if len(self.results) == 0:
            return {"error": "No results to analyze"}
        
        sentiment_counts = Counter([r['sentiment'] for r in self.results])
        total_posts = len(self.results)
        
        # Calculate percentages
        percentages = {
            sentiment: round((count / total_posts) * 100, 1) 
            for sentiment, count in sentiment_counts.items()
        }
        
        # Extract all themes
        all_themes = []
        for result in self.results:
            all_themes.extend(result.get('key_themes', []))
        
        top_themes = Counter(all_themes).most_common(10)
        
        # Calculate average confidence
        avg_confidence = sum([r.get('confidence', 0) for r in self.results]) / total_posts
        
        summary = {
            "total_posts_analyzed": total_posts,
            "sentiment_breakdown": percentages,
            "top_themes": dict(top_themes),
            "average_confidence": round(avg_confidence, 3),
            "analysis_timestamp": datetime.now().isoformat(),
            "sentiment_distribution": dict(sentiment_counts)
        }
        
        return summary
    
    def generate_insights(self) -> List[str]:
        """Generate business insights from sentiment data"""
        summary = self.generate_summary()
        insights = []
        
        if summary.get("error"):
            return ["No data available for insight generation"]
        
        # Sentiment insights
        sentiment_breakdown = summary["sentiment_breakdown"]
        
        if sentiment_breakdown.get("positive", 0) > 50:
            insights.append(f"Strong positive sentiment ({sentiment_breakdown['positive']}%) indicates favorable public opinion")
        elif sentiment_breakdown.get("negative", 0) > 50:
            insights.append(f"High negative sentiment ({sentiment_breakdown['negative']}%) suggests public concerns need addressing")
        
        # Theme insights
        top_themes = summary["top_themes"]
        if top_themes:
            most_common_theme = list(top_themes.keys())[0]
            insights.append(f"'{most_common_theme}' is the most discussed theme ({top_themes[most_common_theme]} mentions)")
        
        # Confidence insights
        avg_confidence = summary["average_confidence"]
        if avg_confidence > 0.8:
            insights.append("High confidence scores indicate clear sentiment patterns")
        elif avg_confidence < 0.6:
            insights.append("Lower confidence scores suggest mixed or ambiguous sentiment")
        
        return insights
    
    def export_results(self, filename: str = None) -> str:
        """Export results to JSON file"""
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"sentiment_analysis_{timestamp}.json"
        
        export_data = {
            "summary": self.generate_summary(),
            "insights": self.generate_insights(),
            "detailed_results": self.results
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(export_data, f, indent=2, ensure_ascii=False, default=str)
        
        logger.info(f"Results exported to {filename}")
        return filename

class SentimentPipeline:
    """Main pipeline orchestrator"""
    
    def __init__(self, reddit_config: Dict[str, str], openai_api_key: str):
        """Initialize the complete pipeline"""
        self.scraper = RedditScraper(**reddit_config)
        self.analyzer = SentimentAnalyzer(openai_api_key)
    
    def run_analysis(self, keywords: str, subreddit: str = "technology", 
                    limit: int = 50) -> Dict[str, Any]:
        """
        Run complete sentiment analysis pipeline
        
        Args:
            keywords: Topic to analyze
            subreddit: Target subreddit
            limit: Number of posts to analyze
            
        Returns:
            Complete analysis results
        """
        logger.info(f"Starting sentiment analysis for '{keywords}' in r/{subreddit}")
        
        # Step 1: Scrape social media data
        posts = self.scraper.scrape_posts(keywords, subreddit, limit)
        if not posts:
            return {"error": "No posts found for the given keywords"}
        
        # Step 2: Extract text for analysis
        texts_to_analyze = []
        for post in posts:
            # Analyze post title and text
            if post['title']:
                texts_to_analyze.append(post['title'])
            if post['text'] and len(post['text']) > 20:
                texts_to_analyze.append(post['text'])
            
            # Analyze top comments
            for comment in post.get('comments', [])[:2]:  # Top 2 comments per post
                if len(comment['text']) > 20:
                    texts_to_analyze.append(comment['text'])
        
        logger.info(f"Extracted {len(texts_to_analyze)} texts for sentiment analysis")
        
        # Step 3: Analyze sentiment
        sentiment_results = self.analyzer.batch_analyze(texts_to_analyze[:limit])
        
        # Step 4: Generate report
        reporter = SentimentReporter(sentiment_results)
        
        # Step 5: Compile final results
        final_results = {
            "query": {
                "keywords": keywords,
                "subreddit": subreddit,
                "posts_found": len(posts),
                "texts_analyzed": len(sentiment_results),
                "analysis_date": datetime.now().isoformat()
            },
            "summary": reporter.generate_summary(),
            "insights": reporter.generate_insights(),
            "sample_posts": posts[:5],  # Include first 5 posts as samples
            "detailed_results": sentiment_results
        }
        
        logger.info(f"Analysis complete for '{keywords}': {len(sentiment_results)} texts analyzed")
        return final_results

def main():
    """
    Example usage of the sentiment analysis pipeline
    """
    # Configuration (replace with your actual API credentials)
    REDDIT_CONFIG = {
        "client_id": "your_reddit_client_id",
        "client_secret": "your_reddit_client_secret", 
        "user_agent": "SentimentAnalyzer/1.0 by YourUsername"
    }
    
    OPENAI_API_KEY = "your_openai_api_key"
    
    # Initialize pipeline
    try:
        pipeline = SentimentPipeline(REDDIT_CONFIG, OPENAI_API_KEY)
        
        # Run analysis
        keywords = input("Enter keywords to analyze: ").strip()
        if not keywords:
            keywords = "artificial intelligence"  # Default
            
        subreddit = input("Enter subreddit (default: technology): ").strip()
        if not subreddit:
            subreddit = "technology"
        
        print(f"\n🔍 Analyzing sentiment for '{keywords}' in r/{subreddit}...")
        
        results = pipeline.run_analysis(keywords, subreddit, limit=50)
        
        if "error" in results:
            print(f"❌ Error: {results['error']}")
            return
        
        # Display results
        summary = results["summary"]
        print(f"\n📊 SENTIMENT ANALYSIS RESULTS")
        print(f"=" * 50)
        print(f"📈 Total posts analyzed: {summary['total_posts_analyzed']}")
        print(f"😊 Positive: {summary['sentiment_breakdown'].get('positive', 0)}%")
        print(f"😞 Negative: {summary['sentiment_breakdown'].get('negative', 0)}%") 
        print(f"😐 Neutral: {summary['sentiment_breakdown'].get('neutral', 0)}%")
        print(f"🎯 Average confidence: {summary['average_confidence']}")
        
        print(f"\n💡 KEY INSIGHTS:")
        for i, insight in enumerate(results["insights"], 1):
            print(f"{i}. {insight}")
        
        print(f"\n🔥 TOP THEMES:")
        for theme, count in list(summary["top_themes"].items())[:5]:
            print(f"• {theme}: {count} mentions")
        
        # Export results
        filename = f"sentiment_analysis_{keywords.replace(' ', '_')}.json"
        reporter = SentimentReporter(results["detailed_results"])
        exported_file = reporter.export_results(filename)
        print(f"\n💾 Results saved to: {exported_file}")
        
    except Exception as e:
        logger.error(f"Pipeline failed: {str(e)}")
        print(f"❌ Analysis failed: {str(e)}")

if __name__ == "__main__":
    main()