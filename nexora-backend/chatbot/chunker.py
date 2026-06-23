def split_text(text, chunk_size=500, overlap=50):
    """
    Splits text into chunks, ensuring headers stay with their paragraphs.
    """
    lines = text.split('\n')
    
    chunks = []
    current_chunk = []
    current_length = 0
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        line_len = len(line)
        
        # Check if adding this line exceeds the chunk size
        if current_length + line_len + 1 > chunk_size and current_length > 0:
            # Check if the last added line looks like a header
            # (Short line, doesn't end with typical paragraph punctuation)
            last_line = current_chunk[-1]
            is_header = len(last_line) < 100 and not last_line.endswith(('.', ':', '?', '!'))
            
            if is_header and len(current_chunk) > 1:
                # Move the header to the next chunk to keep it with its content
                header = current_chunk.pop()
                chunks.append("\n".join(current_chunk))
                
                # Start new chunk with the header and the current line
                current_chunk = [header, line]
                current_length = len(header) + len(line) + 1
            else:
                # No header issue, just finalize the current chunk
                chunks.append("\n".join(current_chunk))
                
                # Handle overlap by carrying over the last few lines that fit
                overlap_chunk = []
                overlap_length = 0
                for prev_line in reversed(current_chunk):
                    if overlap_length + len(prev_line) <= overlap:
                        overlap_chunk.insert(0, prev_line)
                        overlap_length += len(prev_line) + 1
                    else:
                        break
                
                current_chunk = overlap_chunk + [line]
                # Recalculate length based on the overlap and the new line
                current_length = sum(len(l) + 1 for l in current_chunk)
        else:
            current_chunk.append(line)
            current_length += line_len + 1
            
    # Add any remaining text as the last chunk
    if current_chunk:
        chunks.append("\n".join(current_chunk))
        
    return chunks
