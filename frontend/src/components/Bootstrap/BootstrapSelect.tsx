import { Box, Breakpoint, FormControl, FormControlOwnProps, FormHelperText, Select, InputLabel, InputLabelOwnProps, Skeleton, styled, MenuItem, SelectProps } from "@mui/material"
import { inputLabelStyle, inputStyleTheme } from "./BootstrapStyle";

type SizeValue = number | `${number}%`;
type Size = SizeValue | Record<Breakpoint, SizeValue>;

const StyledInput = styled(Select)(inputStyleTheme);

export interface IBootstrapSelect {
    id: string,

    options: Record<string, number>,

    text: {
        label: string,
        helper?: string,
        error?: string
    },

    isRequired?: boolean,
    isDisabled?: boolean,
    isValueLoading?: boolean,

    size: {
        width?: Size,
        height?: Size
    },

    props?: {
        control?: FormControlOwnProps,
        label?: InputLabelOwnProps,
        input?: SelectProps
    }
}

export function BootstrapSelect({
    id,

    options,

    text,

    isRequired,
    isDisabled,
    isValueLoading,

    size,
    props
}: IBootstrapSelect) {
    const {
        control,
        label,
        input
    } = props ?? {};

    return (
        <FormControl
            {...control}
            variant="standard"
            required={isRequired}
            error={!!text.error}
            disabled={isDisabled}
        >
            <InputLabel
                shrink
                htmlFor={id}
                required={isRequired}
                sx={inputLabelStyle}
                {...label}
            >
                {text.label}
            </InputLabel>
            <Box sx={{width: size.width, height: size.height, marginTop: "1.4em"}}>
                {
                isValueLoading && (
                    <Skeleton
                        sx={{ width: "100%", height: "100%", borderRadius: 0.8 }}
                        variant="rectangular"
                    />
                ) || (
                    <StyledInput
                        {...input}
                        id={id}
                        sx={{width: "100%", height: "100%"}}
                        disabled={isDisabled}
                    >
                        {Object.entries(options).map((entry, key) => 
                            <MenuItem value={entry[1]} key={key}>{entry[0]}</MenuItem>
                        )}
                    </StyledInput>
                )
                }
            </Box>
            {
                text.helper && (
                <FormHelperText
                    error={false}
                    sx={{fontSize: "0.8em"}}
                >
                    {text.helper}
                </FormHelperText>
                )
            }
            {
                text.error && (
                <FormHelperText
                    error
                    sx={{fontSize: "0.8em"}}
                >
                    {text.error}
                </FormHelperText>
                )
            }
        </FormControl>
    )
}