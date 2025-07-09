import re
import json
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

class TextParser:
    """Utility class for parsing and extracting information from text"""
    
    @staticmethod
    def extract_emails(text: str) -> List[str]:
        """Extract email addresses from text"""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        return re.findall(email_pattern, text)
    
    @staticmethod
    def extract_phone_numbers(text: str) -> List[str]:
        """Extract phone numbers from text"""
        phone_patterns = [
            r'\b\d{3}-\d{3}-\d{4}\b',  # 123-456-7890
            r'\b\(\d{3}\)\s*\d{3}-\d{4}\b',  # (123) 456-7890
            r'\b\d{3}\.\d{3}\.\d{4}\b',  # 123.456.7890
            r'\b\d{10}\b'  # 1234567890
        ]
        
        phone_numbers = []
        for pattern in phone_patterns:
            phone_numbers.extend(re.findall(pattern, text))
        
        return phone_numbers
    
    @staticmethod
    def extract_dates(text: str) -> List[str]:
        """Extract dates from text"""
        date_patterns = [
            r'\b\d{1,2}/\d{1,2}/\d{4}\b',  # MM/DD/YYYY
            r'\b\d{1,2}-\d{1,2}-\d{4}\b',  # MM-DD-YYYY
            r'\b\d{4}-\d{1,2}-\d{1,2}\b',  # YYYY-MM-DD
            r'\b[A-Za-z]+ \d{1,2}, \d{4}\b'  # Month DD, YYYY
        ]
        
        dates = []
        for pattern in date_patterns:
            dates.extend(re.findall(pattern, text))
        
        return dates
    
    @staticmethod
    def extract_urls(text: str) -> List[str]:
        """Extract URLs from text"""
        url_pattern = r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+'
        return re.findall(url_pattern, text)
    
    @staticmethod
    def extract_currency(text: str) -> List[str]:
        """Extract currency amounts from text"""
        currency_patterns = [
            r'\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?',  # $1,234.56
            r'\$\d+(?:\.\d{2})?',  # $123.45
            r'\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s*(?:USD|dollars?)',  # 1,234.56 USD
        ]
        
        amounts = []
        for pattern in currency_patterns:
            amounts.extend(re.findall(pattern, text, re.IGNORECASE))
        
        return amounts
    
    @staticmethod
    def extract_percentages(text: str) -> List[str]:
        """Extract percentages from text"""
        percentage_pattern = r'\d+(?:\.\d+)?%'
        return re.findall(percentage_pattern, text)
    
    @staticmethod
    def clean_text(text: str) -> str:
        """Clean and normalize text"""
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove special characters but keep basic punctuation
        text = re.sub(r'[^\w\s\.\,\!\?\;\:\-\(\)]', '', text)
        
        # Strip leading/trailing whitespace
        text = text.strip()
        
        return text
    
    @staticmethod
    def extract_key_phrases(text: str, min_length: int = 3) -> List[str]:
        """Extract potential key phrases from text"""
        # Simple approach: extract capitalized phrases
        phrases = re.findall(r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b', text)
        
        # Filter by minimum length
        return [phrase for phrase in phrases if len(phrase.split()) >= min_length]
    
    @staticmethod
    def extract_numbers(text: str) -> List[float]:
        """Extract numeric values from text"""
        # Pattern for numbers (including decimals and commas)
        number_pattern = r'\b\d{1,3}(?:,\d{3})*(?:\.\d+)?\b'
        number_strings = re.findall(number_pattern, text)
        
        numbers = []
        for num_str in number_strings:
            try:
                # Remove commas and convert to float
                num = float(num_str.replace(',', ''))
                numbers.append(num)
            except ValueError:
                continue
        
        return numbers

class DataExtractor:
    """Extract structured data from documents"""
    
    @staticmethod
    def extract_table_data(text: str) -> List[Dict[str, Any]]:
        """Extract table-like data from text"""
        lines = text.split('\n')
        table_data = []
        
        # Look for lines that might be table headers or rows
        for line in lines:
            if '|' in line:  # Pipe-separated values
                cells = [cell.strip() for cell in line.split('|')]
                if len(cells) > 1:
                    table_data.append(cells)
            elif '\t' in line:  # Tab-separated values
                cells = [cell.strip() for cell in line.split('\t')]
                if len(cells) > 1:
                    table_data.append(cells)
        
        return table_data
    
    @staticmethod
    def extract_metrics(text: str) -> Dict[str, Any]:
        """Extract metrics and KPIs from text"""
        metrics = {}
        
        # Extract percentages with context
        percentage_matches = re.finditer(r'(\w+(?:\s+\w+)*)\s*:?\s*(\d+(?:\.\d+)?%)', text, re.IGNORECASE)
        for match in percentage_matches:
            key = match.group(1).strip().lower().replace(' ', '_')
            value = match.group(2)
            metrics[key] = value
        
        # Extract currency amounts with context
        currency_matches = re.finditer(r'(\w+(?:\s+\w+)*)\s*:?\s*(\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?)', text, re.IGNORECASE)
        for match in currency_matches:
            key = match.group(1).strip().lower().replace(' ', '_')
            value = match.group(2)
            metrics[key] = value
        
        # Extract numeric values with context
        numeric_matches = re.finditer(r'(\w+(?:\s+\w+)*)\s*:?\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)', text, re.IGNORECASE)
        for match in numeric_matches:
            key = match.group(1).strip().lower().replace(' ', '_')
            value = match.group(2)
            # Skip if already captured as percentage or currency
            if key not in metrics:
                metrics[key] = value
        
        return metrics
    
    @staticmethod
    def extract_action_items(text: str) -> List[Dict[str, str]]:
        """Extract action items and tasks from text"""
        action_items = []
        
        # Look for common action item patterns
        patterns = [
            r'(?:TODO|Action|Task|Follow[- ]up):\s*(.+)',
            r'(?:•|\*|-)\s*(.+(?:due|by|before).+)',
            r'(?:Need to|Must|Should|Will)\s+(.+)',
        ]
        
        for pattern in patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE | re.MULTILINE)
            for match in matches:
                action_text = match.group(1).strip()
                
                # Try to extract due date
                due_date = None
                date_match = re.search(r'(?:due|by|before)\s+(.+?)(?:\.|$)', action_text, re.IGNORECASE)
                if date_match:
                    due_date = date_match.group(1).strip()
                
                action_items.append({
                    'text': action_text,
                    'due_date': due_date,
                    'priority': 'medium'  # Default priority
                })
        
        return action_items
    
    @staticmethod
    def extract_risks(text: str) -> List[Dict[str, str]]:
        """Extract risks and issues from text"""
        risks = []
        
        # Look for risk-related keywords and patterns
        risk_patterns = [
            r'(?:Risk|Issue|Problem|Concern|Challenge):\s*(.+)',
            r'(?:High|Medium|Low)\s+(?:risk|priority):\s*(.+)',
            r'(?:Warning|Alert|Critical):\s*(.+)',
        ]
        
        for pattern in risk_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE | re.MULTILINE)
            for match in matches:
                risk_text = match.group(1).strip()
                
                # Determine severity based on keywords
                severity = 'medium'
                if any(word in risk_text.lower() for word in ['critical', 'high', 'urgent', 'severe']):
                    severity = 'high'
                elif any(word in risk_text.lower() for word in ['low', 'minor', 'small']):
                    severity = 'low'
                
                risks.append({
                    'description': risk_text,
                    'severity': severity,
                    'category': 'general'
                })
        
        return risks

def parse_document_content(content: str) -> Dict[str, Any]:
    """Parse document content and extract structured information"""
    try:
        parser = TextParser()
        extractor = DataExtractor()
        
        # Basic text parsing
        emails = parser.extract_emails(content)
        phone_numbers = parser.extract_phone_numbers(content)
        dates = parser.extract_dates(content)
        urls = parser.extract_urls(content)
        currency = parser.extract_currency(content)
        percentages = parser.extract_percentages(content)
        numbers = parser.extract_numbers(content)
        
        # Advanced extraction
        metrics = extractor.extract_metrics(content)
        action_items = extractor.extract_action_items(content)
        risks = extractor.extract_risks(content)
        table_data = extractor.extract_table_data(content)
        
        return {
            'basic_info': {
                'emails': emails,
                'phone_numbers': phone_numbers,
                'dates': dates,
                'urls': urls,
                'currency_amounts': currency,
                'percentages': percentages,
                'numbers': numbers[:10]  # Limit to first 10 numbers
            },
            'structured_data': {
                'metrics': metrics,
                'action_items': action_items,
                'risks': risks,
                'tables': table_data[:5]  # Limit to first 5 tables
            },
            'summary': {
                'total_emails': len(emails),
                'total_dates': len(dates),
                'total_urls': len(urls),
                'total_metrics': len(metrics),
                'total_action_items': len(action_items),
                'total_risks': len(risks)
            }
        }
    
    except Exception as e:
        logger.error(f"Error parsing document content: {str(e)}")
        return {
            'error': str(e),
            'basic_info': {},
            'structured_data': {},
            'summary': {}
        }