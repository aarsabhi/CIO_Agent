import os
import logging
from typing import Dict, List, Optional
import PyPDF2
import docx
import pandas as pd
from openpyxl import load_workbook

logger = logging.getLogger(__name__)

class DocumentProcessor:
    def __init__(self):
        self.supported_extensions = {'.pdf', '.docx', '.xlsx', '.csv', '.txt'}
    
    def process_file(self, file_path: str) -> str:
        """Process uploaded file and extract text content"""
        try:
            file_extension = os.path.splitext(file_path)[1].lower()
            
            if file_extension not in self.supported_extensions:
                raise ValueError(f"Unsupported file type: {file_extension}")
            
            if file_extension == '.pdf':
                return self._process_pdf(file_path)
            elif file_extension == '.docx':
                return self._process_docx(file_path)
            elif file_extension == '.xlsx':
                return self._process_xlsx(file_path)
            elif file_extension == '.csv':
                return self._process_csv(file_path)
            elif file_extension == '.txt':
                return self._process_txt(file_path)
            
        except Exception as e:
            logger.error(f"Error processing file {file_path}: {str(e)}")
            raise
    
    def _process_pdf(self, file_path: str) -> str:
        """Extract text from PDF file"""
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
                
                return text.strip()
        
        except Exception as e:
            logger.error(f"Error processing PDF {file_path}: {str(e)}")
            return f"Error processing PDF: {str(e)}"
    
    def _process_docx(self, file_path: str) -> str:
        """Extract text from DOCX file"""
        try:
            doc = docx.Document(file_path)
            text = ""
            
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            
            # Extract text from tables
            for table in doc.tables:
                for row in table.rows:
                    for cell in row.cells:
                        text += cell.text + " "
                    text += "\n"
            
            return text.strip()
        
        except Exception as e:
            logger.error(f"Error processing DOCX {file_path}: {str(e)}")
            return f"Error processing DOCX: {str(e)}"
    
    def _process_xlsx(self, file_path: str) -> str:
        """Extract data from XLSX file"""
        try:
            workbook = load_workbook(file_path, read_only=True)
            text = ""
            
            for sheet_name in workbook.sheetnames:
                sheet = workbook[sheet_name]
                text += f"Sheet: {sheet_name}\n"
                
                for row in sheet.iter_rows(values_only=True):
                    row_text = " | ".join([str(cell) if cell is not None else "" for cell in row])
                    text += row_text + "\n"
                
                text += "\n"
            
            workbook.close()
            return text.strip()
        
        except Exception as e:
            logger.error(f"Error processing XLSX {file_path}: {str(e)}")
            return f"Error processing XLSX: {str(e)}"
    
    def _process_csv(self, file_path: str) -> str:
        """Extract data from CSV file"""
        try:
            df = pd.read_csv(file_path)
            
            # Convert DataFrame to text representation
            text = f"CSV Data Summary:\n"
            text += f"Rows: {len(df)}, Columns: {len(df.columns)}\n\n"
            text += f"Columns: {', '.join(df.columns)}\n\n"
            
            # Add first few rows as sample
            text += "Sample Data:\n"
            text += df.head(10).to_string(index=False)
            
            # Add basic statistics for numeric columns
            numeric_cols = df.select_dtypes(include=['number']).columns
            if len(numeric_cols) > 0:
                text += "\n\nNumeric Column Statistics:\n"
                text += df[numeric_cols].describe().to_string()
            
            return text
        
        except Exception as e:
            logger.error(f"Error processing CSV {file_path}: {str(e)}")
            return f"Error processing CSV: {str(e)}"
    
    def _process_txt(self, file_path: str) -> str:
        """Extract text from TXT file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read()
        
        except UnicodeDecodeError:
            # Try with different encoding
            try:
                with open(file_path, 'r', encoding='latin-1') as file:
                    return file.read()
            except Exception as e:
                logger.error(f"Error processing TXT {file_path}: {str(e)}")
                return f"Error processing TXT: {str(e)}"
        
        except Exception as e:
            logger.error(f"Error processing TXT {file_path}: {str(e)}")
            return f"Error processing TXT: {str(e)}"
    
    def get_file_metadata(self, file_path: str) -> Dict:
        """Get metadata about the processed file"""
        try:
            stat = os.stat(file_path)
            return {
                "filename": os.path.basename(file_path),
                "size": stat.st_size,
                "extension": os.path.splitext(file_path)[1].lower(),
                "modified": stat.st_mtime
            }
        
        except Exception as e:
            logger.error(f"Error getting file metadata {file_path}: {str(e)}")
            return {}