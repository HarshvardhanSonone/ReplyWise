import { useState } from 'react'
import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { Container, Typography } from '@mui/material'
import axios from 'axios';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedReply, setGeneratedReply] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/api/email/generate", {
        content: emailContent, // fixed variable name
        tone
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setGeneratedReply('Error generating email.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Email Writer
      </Typography>

      <Box sx={{ mt: 4 }}>
        <TextField
          label="Your email content"
          multiline
          rows={6}
          variant="outlined"
          fullWidth
          value={emailContent || ''}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mt: 2, mb: 2 }}
        />

        <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
          <InputLabel>Tone  (optional)</InputLabel>
          <Select
            value={tone || ''}
            label="Tone (optional)"
            onChange={(e) => setTone(e.target.value)}
          >
            <MenuItem value="None">None</MenuItem>
            <MenuItem value="Casual">Casual</MenuItem>
            <MenuItem value="Professional">Professional</MenuItem>
            <MenuItem value="Friendly">Friendly</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ mt: 2, backgroundColor: 'green' }}
          disabled={!emailContent || loading}
        >
          {loading ? <CircularProgress size={24} /> : "Generate Email"}
        </Button>
      </Box>

      <Box sx={{ mt: 4 }}>
        <TextField
          multiline
          rows={6}
          variant="outlined"
          fullWidth
          value={generatedReply || ''}
          inputProps={{ readOnly: true }} // fixed prop name
          sx={{ mt: 2, mb: 2 }}
        />
        <Button variant="outlined" onClick={handleCopy}>
          Copy to Clipboard
        </Button>
      </Box>
    </Container>
  );
}

export default App