import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import { Menu } from "../components/Menu";
import { BootstrapInput } from "../components/BootstrapInput/BootstrapInput";
import { useForm } from "react-hook-form";
import { RegisterProductData, registerProductSchema } from "../schemas/product";
import { zodResolver } from "@hookform/resolvers/zod";

export function ProductRegister(): JSX.Element {
    const { 
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterProductData>({
        resolver: zodResolver(registerProductSchema)
    });

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                height: '100%',
                gap: 8
            }}
        >
            <Menu />
            <Box sx={{
                width: 500,
                minHeight: 280,
                maxHeight: 300,
                marginTop: 0.5,
            }}>
                <Paper>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', padding: 1 }}>
                        <Typography variant="h6">Cadastrar produto</Typography>
                    </Box>

                    <Divider />
                    
                    <form
                        onSubmit={handleSubmit(console.log)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            placeItems: 'center',
                            gap: 10,
                            padding: 10
                        }}
                    >
                        <BootstrapInput
                            id="Nome"
                            size={{
                                width: 450,
                                height: 40
                            }}
                            isRequired={true}
                            text={{
                                label: "Nome",
                                error: errors.name?.message
                            }}
                            props={{
                                input: {
                                    type: "text",
                                    ...register("name")
                                }
                            }}
                        />
                        <BootstrapInput
                            id="UnitPrice"
                            size={{
                                width: 450,
                                height: 40
                            }}
                            isRequired={true}
                            text={{
                                label: "Preço unitário",
                                error: errors.unitPrice?.message
                            }}
                            props={{
                                input: {
                                    type: "text",
                                    ...register("unitPrice")
                                }
                            }}
                        />
                        <BootstrapInput
                            id="AmountAvailable"
                            size={{
                                width: 450,
                                height: 40
                            }}
                            isRequired={true}
                            text={{
                                label: "Quantidade disponível",
                                error: errors.amountAvailable?.message
                            }}
                            props={{
                                input: {
                                    type: "number",
                                    ...register("amountAvailable")
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
                            Cadastrar    
                        </Button>
                    </form>
                </Paper>
            </Box>
        </div>
    )
}