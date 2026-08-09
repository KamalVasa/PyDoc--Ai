import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.rag.validation.topic_validator import is_python_topic
print("explain me in detail:", is_python_topic("explain me in detail"))
print("tell me about constructors:", is_python_topic("tell me about constructors"))
