import { Delete } from "@mui/icons-material";
import { ListItem, IconButton, Box, Typography } from "@mui/material";
import { FetchAllProductsResponse } from "../model/responses";

export interface ISaleCartItem {
    products: FetchAllProductsResponse,
    productCode: number,
    amount: number,
    onRemove: (code: number, index: number) => void,
    id: number,
}

export function SaleCartItem({ id, products, productCode, amount, onRemove }: ISaleCartItem): JSX.Element {
    const product = products.find(p => p.code === productCode);

    if (!product) {
        return <></>
    }

    return (
        <ListItem
            secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => onRemove(productCode, id)}>
                    <Delete />
                </IconButton>
            }

            sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 2
                }}
            >
                <Typography fontSize={14} paddingTop={0.10}>{amount}x</Typography>
                <Typography>{product.name}</Typography>
            </Box>
            <Typography>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price * amount)}</Typography>
        </ListItem>
    )
}