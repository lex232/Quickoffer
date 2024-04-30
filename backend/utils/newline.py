"""Переносит строку каждые n символов"""

def insert_newline(string, every=40):
    lines = []
    for i in range(0, len(string), every):
        lines.append(string[i:i+every])
    return '\n'.join(lines)