import { useTheme } from "@emotion/react";
import { LoadingButton } from "@mui/lab";
import { Card, Checkbox, Grid, TextField, MenuItem, Snackbar, Alert, Autocomplete } from "@mui/material";
import { Box, styled } from "@mui/material";
import { Paragraph } from "app/components/Typography";
import useAuth from "app/hooks/useAuth";
import { Formik } from "formik";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";

const FlexBox = styled(Box)(() => ({ display: "flex", alignItems: "center" }));

const JustifyBox = styled(FlexBox)(() => ({ justifyContent: "center" }));

const ContentBox = styled(JustifyBox)(() => ({
  height: "100%",
  padding: "32px",
  background: "rgba(0, 0, 0, 0.01)",
}));

const JWTRegister = styled(JustifyBox)(() => ({
  background: "#1A2038",
  minHeight: "100vh !important",
  "& .card": {
    maxWidth: 800,
    minHeight: 400,
    margin: "1rem",
    display: "flex",
    borderRadius: 12,
    alignItems: "center",
  },
}));

// initial login credentials
const initialValues = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  confirm_password: "",
  phone_number: "",
  industry: "",
  subscription_type: "",
  remember: false,
  country_name: "",
  job_title: "",
};

// form field validation schema
const validationSchema = Yup.object().shape({
  first_name: Yup.string().required("First name is required!"),
  last_name: Yup.string().required("Last name is required!"),
  email: Yup.string()
    .email("Invalid Email address")
    .required("Email is required!"),
  phone_number: Yup.string().required("Phone number is required!"),
  password: Yup.string()
    .min(6, "Password must be 6 character length")
    .required("Password is required!"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required!'),
  industry: Yup.string().required("Industry is required!"),
  subscription_type: Yup.string().required("Subscription type is required!"),
  country_name: Yup.string().required("Country is required!"),
  job_title: Yup.string().required("Job title is required!"),
});

// Add these arrays before the component
const industryOptions = [
  { value: "Pharmaceuticals", label: "Pharmaceuticals" },
  { value: "Healthcare (Hospitals / clinic / lab, etc.)", label: "Healthcare (Hospitals / clinic / lab, etc.)" },
  { value: "E-commerce & Retail", label: "E-commerce & Retail" },
  { value: "Technology & SaaS", label: "Technology & SaaS" },
  { value: "Education & E-learning", label: "Education & E-learning" },
  { value: "Real Estate & Construction", label: "Real Estate & Construction" },
  { value: "Hospitality & Travel", label: "Hospitality & Travel" },
  { value: "Financial Services", label: "Financial Services" },
  { value: "Consulting & Agencies", label: "Consulting & Agencies" },
  { value: "OTHER", label: "OTHER" }
];

const subscriptionOptions = [
  { value: "Free limited Trial", label: "Free limited Trial" },
  { value: "Professional", label: "Professional" },
  { value: "Business", label: "Business" },
  { value: "Enterprise", label: "Enterprise (full features and Tailored)" }
];

const JwtRegister = () => {
  const [countries, setCountries] = useState([]);
  const theme = useTheme();
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then((response) => response.json())
      .then((data) => {
        const sortedCountries = data
          .map(country => ({
            code: country.cca2,
            label: country.name.common
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
        setCountries(sortedCountries);
      })
      .catch((error) => console.error('Error fetching countries:', error));
  }, []);

  const handleFormSubmit = async (values) => {
    setLoading(true);
    console.log(values);
    const { remember, confirm_password, ...registrationData } = values;
    try {
      await register(registrationData);
      setLoading(false);
      navigate("/");
    } catch (e) {
      setOpen(true);
      setLoading(false);
    }
  };
  function handleClose(_, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  }
  return (
    <JWTRegister>
      <Card className="card">
        <Grid container>
          <Grid item sm={6} xs={12}>
            <ContentBox>
              <img
                width="100%"
                alt="Register"
                src="/assets/images/illustrations/posting_photo.svg"
              />
            </ContentBox>
          </Grid>
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity="error"
              sx={{ width: "100%" }}
              variant="filled"
            >
              {t("error try again")}
            </Alert>
          </Snackbar>
          <Grid item sm={6} xs={12}>
            <Box p={4} height="100%">
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
                }) => (
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          size="small"
                          type="text"
                          name="first_name"
                          label="First Name"
                          variant="outlined"
                          onBlur={handleBlur}
                          value={values.first_name}
                          onChange={handleChange}
                          helperText={touched.first_name && errors.first_name}
                          error={Boolean(errors.first_name && touched.first_name)}
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          size="small"
                          type="text"
                          name="last_name"
                          label="Last Name"
                          variant="outlined"
                          onBlur={handleBlur}
                          value={values.last_name}
                          onChange={handleChange}
                          helperText={touched.last_name && errors.last_name}
                          error={Boolean(errors.last_name && touched.last_name)}
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                    </Grid>

                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="job_title"
                      label="Job Title"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.job_title}
                      onChange={handleChange}
                      helperText={touched.job_title && errors.job_title}
                      error={Boolean(errors.job_title && touched.job_title)}
                      sx={{ mb: 2 }}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      name="email"
                      label="Email Address"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.email}
                      onChange={handleChange}
                      helperText={touched.email && errors.email}
                      error={Boolean(errors.email && touched.email)}
                      sx={{ mb: 2 }}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      type="tel"
                      name="phone_number"
                      label="Phone Number"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.phone_number}
                      onChange={handleChange}
                      helperText={touched.phone_number && errors.phone_number}
                      error={Boolean(errors.phone_number && touched.phone_number)}
                      sx={{ mb: 2 }}
                    />

                    <Autocomplete
                      fullWidth
                      options={countries}
                      getOptionLabel={(option) => option.label}
                      value={countries.find(country => country.code === values.country_name) || null}
                      onChange={(_, newValue) => {
                        handleChange({
                          target: {
                            name: 'country_name',
                            value: newValue ? newValue.code : ''
                          }
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          name="country_name"
                          label="Country"
                          variant="outlined"
                          onBlur={handleBlur}
                          helperText={touched.country_name && errors.country_name}
                          error={Boolean(errors.country_name && touched.country_name)}
                          sx={{ mb: 2 }}
                        />
                      )}
                    />

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          size="small"
                          type="password"
                          name="password"
                          label="Password"
                          variant="outlined"
                          onBlur={handleBlur}
                          value={values.password}
                          onChange={handleChange}
                          helperText={touched.password && errors.password}
                          error={Boolean(errors.password && touched.password)}
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          size="small"
                          type="password"
                          name="confirm_password"
                          label="Confirm Password"
                          variant="outlined"
                          onBlur={handleBlur}
                          value={values.confirm_password}
                          onChange={handleChange}
                          helperText={touched.confirm_password && errors.confirm_password}
                          error={Boolean(errors.confirm_password && touched.confirm_password)}
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                    </Grid>

                    <TextField
                      select
                      fullWidth
                      size="small"
                      name="industry"
                      label="Industry"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.industry}
                      onChange={handleChange}
                      helperText={touched.industry && errors.industry}
                      error={Boolean(errors.industry && touched.industry)}
                      sx={{ mb: 2 }}
                    >
                      {industryOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      select
                      fullWidth
                      size="small"
                      name="subscription_type"
                      label="Type of subscription"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.subscription_type}
                      onChange={handleChange}
                      helperText={touched.subscription_type && errors.subscription_type}
                      error={Boolean(errors.subscription_type && touched.subscription_type)}
                      sx={{ mb: 2 }}
                    >
                      {subscriptionOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>

                    <FlexBox gap={1} alignItems="center">
                      <Checkbox
                        size="small"
                        name="remember"
                        onChange={handleChange}
                        checked={values.remember}
                        sx={{ padding: 0 }}
                      />
                      <Paragraph fontSize={13}>
                        I agree and understand the Privacy policy, Data Processing Agreement (DPA) and Terms of use.
                        <br />
                        <NavLink to="/privacy-policy" style={{ color: 'red' }}>
                          Privacy policy
                        </NavLink>
                        {' '}and{' '}
                        <NavLink to="/terms-of-use" style={{ color: 'red' }}>
                          Terms of use
                        </NavLink>
                      </Paragraph>
                    </FlexBox>

                    <LoadingButton
                      type="submit"
                      color="primary"
                      loading={loading}
                      variant="contained"
                      sx={{ mb: 2, mt: 3, width: '100%' }}
                    >
                      Register
                    </LoadingButton>

                    <Paragraph>
                      Already have an account?
                      <NavLink
                        to="/session/signin"
                        style={{
                          color: theme.palette.primary.main,
                          marginLeft: 5,
                        }}
                      >
                        Login
                      </NavLink>
                    </Paragraph>
                  </form>
                )}
              </Formik>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </JWTRegister>
  );
};

export default JwtRegister;
