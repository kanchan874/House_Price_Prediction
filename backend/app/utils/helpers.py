def format_indian_currency(num: float) -> str:
    """Formats a float value as standard Indian currency (e.g. 6842000 -> '₹68,42,000')."""
    try:
        num = round(float(num))
    except (ValueError, TypeError):
        return "₹0"
        
    s = str(abs(num))
    if len(s) <= 3:
        formatted = s
    else:
        last_three = s[-3:]
        remaining = s[:-3]
        groups = []
        while len(remaining) > 0:
            groups.append(remaining[-2:])
            remaining = remaining[:-2]
        groups.reverse()
        formatted = ",".join(groups) + "," + last_three
        
    prefix = "-" if num < 0 else ""
    return f"{prefix}₹{formatted}"

def format_lakhs_or_crores(num: float) -> str:
    """Formats a float value in terms of Lakhs or Crores (e.g. 6842000 -> '₹68.42 Lakhs')."""
    try:
        val = float(num)
    except (ValueError, TypeError):
        return "₹0"
        
    abs_val = abs(val)
    prefix = "-" if val < 0 else ""
    
    if abs_val >= 10_000_000:
        return f"{prefix}₹{abs_val / 10_000_000:.2f} Crores"
    elif abs_val >= 100_000:
        return f"{prefix}₹{abs_val / 100_000:.2f} Lakhs"
    else:
        return format_indian_currency(val)
