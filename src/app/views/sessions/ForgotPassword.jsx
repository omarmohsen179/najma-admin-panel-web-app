import { Box, Button, Card, Grid, styled, TextField } from "@mui/material";
import REQUEST from "app/services/Request";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FlexBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
}));

const JustifyBox = styled(FlexBox)(() => ({
  justifyContent: "center",
}));

const ContentBox = styled(Box)(({ theme }) => ({
  padding: 32,
  background: theme.palette.background.default,
}));

const ForgotPasswordRoot = styled(JustifyBox)(() => ({
  background: "#1A2038",
  minHeight: "100vh !important",
  "& .card": {
    maxWidth: 800,
    margin: "1rem",
    borderRadius: 12,
  },
}));

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await REQUEST({
        method: "post",
        url: "/password/forgot-password",
        data: { email },
      });
      console.log(response)
      if (response.success) {
        // Handle successful response
        alert('Password reset link has been sent to your email');
        navigate(-1);
      } else {
        // Handle error response
        alert('Failed to send reset link. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <ForgotPasswordRoot>
      <Card className="card">
        <Grid container>
          <Grid item xs={12}>
            <JustifyBox p={4}>
              <img
                width="300"
                src="/assets/images/illustrations/dreamer.svg"
                alt=""
              />
            </JustifyBox>

            <ContentBox>
              <form onSubmit={handleFormSubmit}>
                <TextField
                  type="email"
                  name="email"
                  size="small"
                  label="Email"
                  value={email}
                  variant="outlined"
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mb: 3, width: "100%" }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  
                >
                  Reset Password
                </Button>

                <Button
                  fullWidth
                  color="primary"
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  sx={{ mt: 2 }}
                >
                  Go Back
                </Button>
              </form>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </ForgotPasswordRoot>
  );
};

export default ForgotPassword;
