import { LoadingButton } from "@mui/lab";
import { Typography, Box, Container, TextField, Paper, Grid, CssBaseline, Button } from "@mui/material";
import { useState } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const API_WEATHER = `http://api.weatherapi.com/v1/current.json?key=be3336a245ad4b5ca42221936240606&aqi=no&q=`;

const theme = createTheme({
  palette: {
    primary: {
      main: '#0288d1',
    },
    secondary: {
      main: '#ffffff',
    },
  },
  typography: {
    h3: {
      fontWeight: 700,
      color: '#ffffff',
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 400,
    },
  },
});

export default function App() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    error: false,
    message: "",
  });

  const [weather, setWeather] = useState({
    city: "",
    country: "",
    temp: "",
    condition: "",
    icon: "",
    conditionText: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({
      error: false,
      message: "",
    });
    try {
      if (!city.trim()) throw { message: "El campo ciudad es obligatorio" };
      const response = await fetch(`${API_WEATHER}${city}`);
      const data = await response.json();
      if (data.error) throw { message: data.error.message };
      setWeather({
        city: data.location.name,
        country: data.location.country,
        temp: data.current.temp_c,
        condition: data.current.condition.code,
        icon: data.current.condition.icon,
        conditionText: data.current.condition.text,
      });
    } catch (error) {
      setError({
        error: true,
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const onClear = () => {
    setCity("");
    setWeather({
      city: "",
      country: "",
      temp: "",
      condition: "",
      icon: "",
      conditionText: "",
    });
    setError({
      error: false,
      message: "",
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0288d1 30%, #26c6da 90%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 3,
        }}
      >
        <Container maxWidth="xs">
          <Typography variant="h3" component="h1" align="center" gutterBottom>
            Weather App
          </Typography>
          <Box
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: 2,
              boxShadow: 3,
              p: 3,
            }}
          >
            <Box
              sx={{ display: "grid", gap: 2 }}
              component="form"
              autoComplete="off"
              onSubmit={onSubmit}
            >
              <TextField
                id="city"
                label="Ciudad"
                variant="outlined"
                size="small"
                required
                fullWidth
                value={city}
                onChange={(e) => setCity(e.target.value)}
                error={error.error}
                helperText={error.message}
              />
              <LoadingButton
                type="submit"
                variant="contained"
                loading={loading}
                loadingIndicator="Cargando..."
                fullWidth
              >
                Buscar
              </LoadingButton>
              <Button
                variant="outlined"
                onClick={onClear}
                fullWidth
              >
                Limpiar
              </Button>
            </Box>
            {weather.city && (
              <Paper
                elevation={3}
                sx={{
                  mt: 4,
                  p: 2,
                  textAlign: "center",
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 2,
                }}
              >
                <Typography variant="h4" component="h2">
                  {weather.city}, {weather.country}
                </Typography>
                <Box
                  component="img"
                  alt={weather.conditionText}
                  src={weather.icon}
                  sx={{ width: 100, height: 100, m: "0 auto" }}
                />
                <Typography variant="h5" component="h3">
                  {weather.temp} °C
                </Typography>
                <Typography variant="h6" component="h4">
                  {weather.conditionText}
                </Typography>
              </Paper>
            )}
          </Box>
          <Typography textAlign="center" sx={{ mt: 2, fontSize: "10px", color: '#ffffff' }}>
            Powered by:{" "}
            <a href="https://www.weatherapi.com/" title="Weather API" style={{ color: '#ffffff' }}>
              weatherAPI.com
            </a>
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

