import { PersonAdd, Inventory, AddShoppingCart, AddBox, PersonSearch, Description } from "@mui/icons-material";
import { Paper, MenuList, MenuItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";

export function Menu() {
    const navigate = useNavigate();
    
    return (
        <Paper sx={{ width: 316, maxWidth: '100%', height: '100%' }}>
            <MenuList>
                <MenuItem onClick={() => navigate('/register/client')}>
                    <ListItemIcon>
                        <PersonAdd fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Adicionar cliente</ListItemText>
                </MenuItem>

                <MenuItem onClick={() => navigate('/register/product')}>
                    <ListItemIcon>
                        <AddBox fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Adicionar produto</ListItemText>
                </MenuItem>

                <MenuItem onClick={() => navigate('/register/sale')}>
                    <ListItemIcon>
                        <AddShoppingCart fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Iniciar venda</ListItemText>
                </MenuItem>

                <Divider />

                <MenuItem onClick={() => navigate('/view/stock')}>
                    <ListItemIcon>
                        <Inventory fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Estoque</ListItemText>
                </MenuItem>

                <Divider />
                
                <MenuItem onClick={() => navigate('/view/client')}>
                    <ListItemIcon>
                        <PersonSearch fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Procurar cliente</ListItemText>
                </MenuItem>

                <MenuItem onClick={() => navigate('/view/report')}>
                    <ListItemIcon>
                        <Description fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Ver relatórios</ListItemText>
                </MenuItem>
            </MenuList>
        </Paper>
    )
}