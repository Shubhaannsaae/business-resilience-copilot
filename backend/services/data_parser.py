import io
from typing import Dict, Any
import pandas as pd

def parse_csv_and_summarize(file_bytes: bytes) -> Dict[str, Any]:
    df = pd.read_csv(io.BytesIO(file_bytes))
    # Normalize column names to lowercase for consistent access
    df.columns = df.columns.str.lower()

    # Ensure required columns are present
    required_cols = {"date", "type", "amount", "counterparty"}
    missing = required_cols - set(df.columns)
    if missing:
        raise ValueError(f"Missing required columns: {', '.join(sorted(missing))}")
    # Expected columns: date, type(sale|expense), amount, counterparty (client or supplier)
    df['amount'] = pd.to_numeric(df['amount'], errors='coerce').fillna(0.0)
    sales = df[df['type'].str.lower() == 'sale']
    expenses = df[df['type'].str.lower() == 'expense']
    revenue_monthly = sales['amount'].sum()
    expenses_monthly = expenses['amount'].sum()
    cash_on_hand = max(0.0, (revenue_monthly - expenses_monthly) * 2)  # conservative proxy if not given
    client_share = sales.groupby('counterparty')['amount'].sum().sort_values(ascending=False)
    if len(client_share) > 0:
        # Get the top client (highest revenue contributor)
        top_client_name = str(client_share.index[0])
        top_client_share = float(client_share.iloc[0] / max(1.0, revenue_monthly))
    else:
        top_client_name, top_client_share = None, None
    supplier_concentration = 1.0
    if not expenses.empty:
        supplier_spend = expenses.groupby('counterparty')['amount'].sum()
        supplier_concentration = float(supplier_spend.max() / max(1.0, supplier_spend.sum()))
    return {
        "revenue_monthly": float(revenue_monthly),
        "expenses_monthly": float(expenses_monthly),
        "cash_on_hand": float(cash_on_hand),
        "top_client_name": top_client_name,
        "top_client_share": float(top_client_share) if top_client_share is not None else None,
        "supplier_concentration": float(supplier_concentration),
        "raw_preview": df.head(50).to_dict(orient="records")
    }
