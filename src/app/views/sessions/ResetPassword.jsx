import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button, Card, Grid, Snackbar, styled, TextField, useTheme } from "@mui/material";
import { Paragraph } from "app/components/Typography";
import REQUEST from "app/services/Request";
import { Formik } from "formik";
import { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import * as Yup from "yup";

const FlexBox = styled(Box)(() => ({ display: "flex", alignItems: "center" }));

const JustifyBox = styled(FlexBox)(() => ({ justifyContent: "center" }));

const ContentBox = styled(Box)(() => ({
    height: "100%",
    padding: "32px",
    position: "relative",
    background: "rgba(0, 0, 0, 0.01)",
}));

const JWTRoot = styled(JustifyBox)(() => ({
    background: "#1A2038",
    minHeight: "100% !important",
    "& .card": {
        maxWidth: 800,
        minHeight: 400,
        margin: "1rem",
        display: "flex",
        borderRadius: 12,
        alignItems: "center",
    },
}));

const initialValues = {
    password: "",
    confirmPassword: "",
};

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const theme = useTheme();

    // Extract otp from query parameters
    const queryParams = new URLSearchParams(location.search);
    const otp = queryParams.get('otp');

    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .min(6, t("Password must be 6 character length"))
            .required(t("Password is required!")),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], t("Passwords must match"))
            .required(t("Confirm password is required!"))
    });

    useEffect(() => {
        console.log(otp);
        if (!otp) {
            navigate('/session/signin');
        }
    }, [otp, navigate]);

    const handleFormSubmit = async (values, { setSubmitting }) => {
        setLoading(true);
        try {
            const response = await REQUEST({
                method: "post",
                url: "/password/reset-password",
                data: { 
                    password: values.password,
                    otp: otp
                },
            });
            
            if (response.success) {
                alert(t('Password has been reset successfully'));
                navigate('/session/signin');
            } else {
                setError(t('Failed to reset password. Please try again.'));
            }
        } catch (error) {
            console.error('Error:', error);
            setError(t('An error occurred. Please try again later.'));
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    function handleClose(_, reason) {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    }

    return (
        <JWTRoot>
            <Card className="card">
                <Grid container>
                    <Grid item sm={6} xs={12}>
                        <JustifyBox p={4} height="100%" sx={{ minWidth: 320 }}>
                            <img
                                src="/assets/images/illustrations/dreamer.svg"
                                width="100%"
                                alt=""
                            />
                        </JustifyBox>
                    </Grid>

                    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                        <Alert
                            onClose={handleClose}
                            severity="error"
                            sx={{ width: "100%" }}
                            variant="filled"
                        >
                            {error}
                        </Alert>
                    </Snackbar>
                    <Grid item sm={6} xs={12}>
                        <ContentBox>
                            {error && (
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    {error}
                                </Alert>
                            )}
                            <Formik
                                onSubmit={handleFormSubmit}
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                            >
                                {({
                                    values,
                                    errors,
                                    touched,
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                    isSubmitting
                                }) => (
                                    <form onSubmit={handleSubmit}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            name="password"
                                            type="password"
                                            label={t("New Password")}
                                            variant="outlined"
                                            onBlur={handleBlur}
                                            value={values.password}
                                            onChange={handleChange}
                                            helperText={touched.password && errors.password}
                                            error={Boolean(errors.password && touched.password)}
                                            sx={{ mb: 3 }}
                                        />

                                        <TextField
                                            fullWidth
                                            size="small"
                                            name="confirmPassword"
                                            type="password"
                                            label={t("Confirm Password")}
                                            variant="outlined"
                                            onBlur={handleBlur}
                                            value={values.confirmPassword}
                                            onChange={handleChange}
                                            helperText={touched.confirmPassword && errors.confirmPassword}
                                            error={Boolean(errors.confirmPassword && touched.confirmPassword)}
                                            sx={{ mb: 3 }}
                                        />

                                        <LoadingButton
                                            type="submit"
                                            color="primary"
                                            loading={loading}
                                            variant="contained"
                                            disabled={isSubmitting}
                                            sx={{ my: 2 }}
                                        >
                                            {t("Reset Password")}
                                        </LoadingButton>
                                        <Paragraph>
                                            <NavLink
                                                to="/session/signin"
                                                style={{
                                                    color: theme.palette.primary.main,
                                                    marginLeft: 5,
                                                }}
                                            >
                                                {t("Return to Login")}
                                            </NavLink>
                                        </Paragraph>

                                    </form>
                                )}
                            </Formik>
                        </ContentBox>
                    </Grid>
                </Grid>
            </Card>
        </JWTRoot>
    );
};

export default ResetPassword;
