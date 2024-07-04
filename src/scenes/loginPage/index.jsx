import React, { useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Button,
  Grid,
} from "@mui/material";
import Form from "./Form";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [showInstructions, setShowInstructions] = useState(false);

  const handleToggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
      >
         <Grid item xs={isNonMobileScreens ? 3 : 12} md={10}>
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          PeaceGuard
        </Typography>
        </Grid>
        {/* User Instructions Button */}
        <Button
          onClick={handleToggleInstructions}
          variant="outlined"
          sx={{
            color: theme.palette.primary.main,
            "&:hover": {
              cursor: "pointer",
              color: theme.palette.primary.main,
            },
          }}
        >
          View User Instructions
        </Button>
      </Box>

      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Welcome to PeaceGuard!
        </Typography>
        <Form />
      </Box>

      {/* User Instructions Dialog */}
      {showInstructions && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            p="2rem"
            backgroundColor={theme.palette.background.paper}
            borderRadius="1rem"
            maxWidth="90%"
            maxHeight="90%"
            overflow="auto"
          >
            <Typography variant="h6" sx={{ mb: "1rem" }}>
              User Instructions
            </Typography>
            <Typography variant="body1">
              {/* Insert your user instructions here */}
              Welcome to our app! Please read and agree to the guidelines
              before proceeding.<br></br>
              {/* Add your user instructions content here */}
              1.Always communicate respectfully and courteously with other users. Avoid any form of harassment, hate speech, or offensive language.<br></br>
              2.If you post harmful comments repeatedly, your user profile may be subject to removal or suspension.<br></br>
              3.We prioritize creating a safe space for all users, and actions against harmful behavior are taken seriously.<br></br>
              4.If you believe your profile was flagged in error or wish to appeal a decision, please contact our support team promptly.<br></br>
            </Typography>
            {/* Add more instructions as needed */}
            <Button
              onClick={handleToggleInstructions}
              variant="outlined"
              sx={{ mt: "1rem" }}
            >
              Close
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default LoginPage;
