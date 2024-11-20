import { Box, Breakpoint, FormControl, FormControlOwnProps, FormHelperText, InputBase, InputBaseProps, InputLabel, InputLabelOwnProps, Skeleton, styled } from "@mui/material"
import { inputLabelStyle, inputStyleTheme } from "./BootstrapStyle";

type SizeValue = number | `${number}%`;
type Size = SizeValue | Record<Breakpoint, SizeValue>;

const StyledInput = styled(InputBase)(inputStyleTheme);

export interface IBootstrapInput {
    id: string,

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
        input?: InputBaseProps
    }
}

export function BootstrapInput({
    id,
    text,

    isRequired,
    isDisabled,
    isValueLoading,

    size,
    props
}: IBootstrapInput) {
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
                    />
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