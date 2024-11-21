import { List, ListSubheader, ListItem, Typography, Divider, Button } from "@mui/material";
import { BootstrapInput } from "./Bootstrap/BootstrapInput";
import { BootstrapSelect } from "./Bootstrap/BootstrapSelect";
import { FetchAllProductsResponse } from "../model/responses";
import { CartModel } from "../model/cart";
import { CartData, cartSchema } from "../schemas/cart";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { SaleCartItem } from "./SaleCartItem";

export interface ISaleCart {
    products: FetchAllProductsResponse,
    cart: CartModel,
    setCart: React.Dispatch<React.SetStateAction<CartModel>>
}

export function SaleCart({ products, cart, setCart }: ISaleCart): JSX.Element {
    const { 
        register,
        handleSubmit,
        setError,
        watch,
        reset,
        clearErrors,
        formState: { errors }
    } = useForm<CartData>({
        resolver: zodResolver(cartSchema),
        defaultValues: {
            amount: 0,
            productCode: products[0].code
        }
    });

    const onRemoveItem = (_: number, index: number) => {
        setCart(cart => cart.filter((_, idx) => idx !== index));
    }

    const getAmountAvailable = useCallback((productCode: number) => {
        const product = products.find(p => p.code === productCode);
        const amountInCart = cart.filter(p => p.productCode === productCode).reduce((acc, curr) => acc + curr.amount, 0);

        return (product?.amountAvailable ?? 0) - amountInCart;
    }, [cart, products]);

    const getTotalInCart = () => {
        let total = 0;

        for (const item of cart) {
            const product = products.find(p => p.code === item.productCode);

            if (!product) continue;

            total += product.price * item.amount;
        }

        return total;
    }
    
    const formValues = watch();

    const onSubmit = (data: CartData) => {
        reset();
        setCart(cart => [...cart, data]);
    }

    useEffect(() => {
        const amount = getAmountAvailable(formValues.productCode);

        if (amount === 0) {
            setError("productCode", {
                message: "Este produto não está disponível."
            });
        } else {
            clearErrors("productCode");
        }
    }, [cart, clearErrors, errors.productCode?.type, formValues.productCode, getAmountAvailable, setError]);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
                display: 'flex',
                flexDirection: 'column',
                placeItems: 'center',
                gap: 10,
                padding: 10,
            }}
        >
            <List
                sx={{ width: 450, maxHeight: 200, overflow: 'auto', bgcolor: 'background.paper' }}
                component="nav"
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        Carrinho
                    </ListSubheader>
                }
            >
                {cart.map((item, key) => 
                    <SaleCartItem id={key} products={products} productCode={item.productCode} amount={item.amount} key={key} onRemove={onRemoveItem} />
                )}
                <Divider />
                <ListItem
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingTop: 2
                    }}
                >
                    <Typography>Total</Typography>
                    <Typography>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(getTotalInCart())}</Typography>
                </ListItem>
            </List>

            <BootstrapSelect
                id="ProductName"
                size={{
                    width: 450,
                    height: 40
                }}
                options={
                    products.map(product => ({
                        label: `${product.code}. ${product.name} | ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)} | Qtd. Disponível: ${getAmountAvailable(product.code)}`,
                        value: product.code,
                        disabled: getAmountAvailable(product.code) === 0
                    }))
                }
                isRequired={true}
                text={{
                    label: "Produto",
                    error: errors.productCode?.message
                }}
                props={{
                    input: {
                        ...register("productCode")
                    }
                }}
            />

            <BootstrapInput
                id="Amount"
                size={{
                    width: 450,
                    height: 40
                }}
                isRequired={true}
                text={{
                    label: "Quantidade",
                    error: errors.amount?.message
                }}
                props={{
                    input: {
                        type: "number",
                        inputProps: {
                            min: getAmountAvailable(formValues.productCode) > 0 ? 1 : 0,
                            max: getAmountAvailable(formValues.productCode)
                        },
                        ...register("amount")
                    }
                }}
            />

            <Button
                type="submit"
                sx={{
                    width: 450,
                    height: 40
                }}
                variant="outlined"
            >
                Adicionar ao carrinho
            </Button>
        </form>
    )
}