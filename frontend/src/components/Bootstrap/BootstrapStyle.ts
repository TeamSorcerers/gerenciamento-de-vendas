import { alpha, Theme } from "@mui/material";
import type { SxProps } from "@mui/material";

export const inputLabelStyle: SxProps<Theme> = {
    fontWeight: 400,
    fontSize: "1em",
    color: "#273A57",
    textTransform: "uppercase",
    fontFamily: "\"Roboto\", sans-serif"
}

export const inputStyleTheme = ({ theme }: { theme: Theme }) => ({
    'label + &': {
        marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.mode === 'light' ? '#F3F6F9' : '#1A2027',
        border: '1px solid',
        borderColor: theme.palette.mode === 'light' ? '#E0E3E7' : '#2D3843',
        fontSize: 16,
        padding: '10px 12px',
        transition: theme.transitions.create([
            'border-color',
            'background-color',
            'box-shadow',
        ]),
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),

        '&:focus': {
            boxShadow: `${alpha("#395063", 0.25)} 0 0 0 0.2rem`,
            borderColor: "#395063",
        },
    },
}); 