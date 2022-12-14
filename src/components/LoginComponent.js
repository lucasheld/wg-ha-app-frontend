import {useStoreSession} from "../store";
import {Box, Button, TextField} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import {useRef} from "react";

const LoginComponent = () => {
    const login = useStoreSession((state) => state.login);

    const {control, handleSubmit} = useForm({
        defaultValues: {
            username: "",
            password: ""
        }
    });

    const onSubmit = data => {
        login(data);
    }

    const formRef = useRef(null)

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="60vh"
        >
            <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="username"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            required
                            autoFocus
                            margin="dense"
                            label="Username"
                            type="text"
                            fullWidth
                        />
                    )}
                />
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            required
                            margin="dense"
                            label="Password"
                            type="password"
                            fullWidth
                        />
                    )}
                />
                <Button
                    style={{marginTop: 8}}
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    type="submit"
                >
                    Login
                </Button>
            </form>
        </Box>
    )
}

export default LoginComponent;
