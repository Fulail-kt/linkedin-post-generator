'use client';

import { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Divider,
  Chip,
  Fab,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
  Stack,
} from '@mui/material';
import {
  Send as SendIcon,
  ContentCopy as ContentCopyIcon,
  AutoFixHigh as AutoFixHighIcon,
  LinkedIn as LinkedInIcon,
  AutoAwesome as SparklesIcon,
} from '@mui/icons-material';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import type { LinkedInPostResponse } from '../../baml_client/types';

// LinkedIn color theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0077B5', // LinkedIn blue
      light: '#00A0DC',
      dark: '#004182',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#666666', // LinkedIn gray
      light: '#8E8E8E',
      dark: '#424242',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F3F2EF', // LinkedIn background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
    },
    grey: {
      50: '#F8F9FA',
      100: '#F3F2EF',
      200: '#E9E5DF',
      300: '#D6D0C4',
      500: '#666666',
    },
  },
  typography: {
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 500,
      letterSpacing: '0.025em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          '&:focus': {
            outline: 'none !important',
          },
          '&:focus-visible': {
            outline: 'none !important',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          border: '1px solid #E9E5DF',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:focus': {
            outline: 'none',
            boxShadow: 'none',
          },
          '&:focus-visible': {
            outline: 'none',
            boxShadow: 'none',
          },
        },
        contained: {
          backgroundColor: '#0077B5',
          '&:hover': {
            backgroundColor: '#004182',
            boxShadow: '0 2px 8px rgba(0, 119, 181, 0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#FFFFFF',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: '#FFFFFF',
            },
            '&.Mui-focused': {
              backgroundColor: '#FFFFFF',
              outline: 'none',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#0077B5',
                borderWidth: '2px',
              },
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#D6D0C4',
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#0077B5',
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#0077B5',
          '&:hover': {
            backgroundColor: '#004182',
            transform: 'scale(1.05)',
          },
          '&:focus': {
            outline: 'none',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
      },
    },
  },
});

export default function LinkedInGenerator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LinkedInPostResponse | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    companyDescription: '',
    targetAudience: '',
    whatWeOffer: '',
  });

  // Function to format text for LinkedIn preview
  const formatLinkedInText = (text: string) => {
    return text
      // Convert **bold** to <strong>
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Handle numbered lists with bold headings (1. **Text**: content)
      .replace(/^(\d+)\.\s+\*\*(.*?)\*\*:\s*(.*?)$/gm, '$1. <strong>$2:</strong> $3')
      // Handle regular numbered lists (1. Text)
      .replace(/^(\d+)\.\s+([^*].*?)$/gm, '$1. $2')
      // Convert line breaks to proper spacing
      .replace(/\n\n/g, '<br /><br />')
      .replace(/\n/g, '<br />')
      // Handle hashtags at the end
      .replace(/#(\w+)/g, '<span style="color: #0077B5; font-weight: 500; cursor: pointer;">#$1</span>')
      // Add proper spacing after colons
      .replace(/:\s*/g, ': ')
      // Clean up extra spaces
      .replace(/\s+/g, ' ')
      .trim();
  };

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate post');
      }
      
      const post = await response.json();
      setResult(post);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result) {
      const text = `${result.hook}\n\n${result.content}`;
      await navigator.clipboard.writeText(text);
      setSnackbarOpen(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* LinkedIn Style App Bar */}
      <AppBar 
        position="static" 
        elevation={1} 
        sx={{ 
          bgcolor: '#0077B5',
          borderRadius: 0,
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box display="flex" alignItems="center" sx={{ mr: 2 }}>
            <LinkedInIcon sx={{ mr: 1, fontSize: 28 }} />
            <SparklesIcon sx={{ fontSize: 20, opacity: 0.8 }} />
          </Box>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            LinkedIn Post Generator
          </Typography>
        
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ 
        height: 'calc(100vh - 80px)', 
        bgcolor: '#F3F2EF',
      }}>
        <PanelGroup direction="horizontal">
          {/* Left Panel - Form */}
          <Panel defaultSize={45} minSize={30}>
            <Container maxWidth="md" sx={{ py: 4, height: '100%', overflow: 'auto' }}>
              <Card elevation={0} sx={{ height: 'fit-content' }}>
                <CardContent sx={{ p: 4 }}>
                                      <Stack direction="row" alignItems="center" spacing={2} mb={4}>
                      <Box 
                        sx={{ 
                          p: 2, 
                          borderRadius: 2, 
                          bgcolor: '#0077B5',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <AutoFixHighIcon sx={{ color: 'white', fontSize: 24 }} />
                      </Box>
                    <Box>
                      <Typography variant="h5" component="h1" fontWeight="700" color="text.primary">
                        Create Your Post
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tell us about your company and we'll craft the perfect LinkedIn post
                      </Typography>
                    </Box>
                  </Stack>
                  
                  <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                      <TextField
                        label="Company Name"
              name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange('companyName')}
                        placeholder="e.g. 'Tech Innovators Inc.'"
                        variant="outlined"
                        fullWidth
              required
            />
                      
                      <TextField
                        label="What does your company do?"
              name="companyDescription"
                        value={formData.companyDescription}
                        onChange={handleInputChange('companyDescription')}
                        placeholder="We revolutionize how businesses manage their data with AI-powered analytics..."
                        multiline
              rows={3}
                        variant="outlined"
                        fullWidth
              required
            />
                      
                      <TextField
                        label="Target Audience"
              name="targetAudience"
                        value={formData.targetAudience}
                        onChange={handleInputChange('targetAudience')}
                        placeholder="Data analysts, business intelligence professionals, CTOs"
                        variant="outlined"
                        fullWidth
              required
            />
                      
                      <TextField
                        label="What value do you provide?"
              name="whatWeOffer"
                        value={formData.whatWeOffer}
                        onChange={handleInputChange('whatWeOffer')}
                        placeholder="We help teams make data-driven decisions 10x faster with our intuitive platform..."
                        multiline
              rows={3}
                        variant="outlined"
                        fullWidth
              required
            />
                    </Stack>
                  </form>
                </CardContent>
                
                <CardActions sx={{ p: 4, pt: 0 }}>
                  <Button
          type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
          disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                    onClick={(e) => handleSubmit(e as any)}
                    sx={{ py: 2, fontSize: '1.1rem' }}
                  >
                    {loading ? 'Crafting your post...' : 'Generate LinkedIn Post'}
                  </Button>
                </CardActions>
              </Card>
            </Container>
          </Panel>

          {/* Resize Handle */}
          <PanelResizeHandle style={{
            width: '2px',
            background: '#D6D0C4',
            cursor: 'col-resize',
            position: 'relative',
            transition: 'all 0.2s ease',
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '4px',
              height: '40px',
              background: '#0077B5',
              borderRadius: '2px',
              opacity: 0.8,
            }} />
          </PanelResizeHandle>

          {/* Right Panel - Results */}
          <Panel defaultSize={55} minSize={30}>
            <Container maxWidth="lg" sx={{ py: 4, height: '100%', overflow: 'auto' }}>
              {result ? (
                <Card elevation={0} sx={{ height: 'fit-content' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
                      <Box>
                        <Typography variant="h5" component="h2" fontWeight="700" color="text.primary">
                          Your LinkedIn Post
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Ready to share with your network
                        </Typography>
                      </Box>
                      <Fab
                        size="medium"
                        onClick={handleCopy}
                        sx={{ boxShadow: '0 2px 8px rgba(0, 119, 181, 0.3)' }}
                      >
                        <ContentCopyIcon />
                      </Fab>
                    </Stack>
                    
                    {/* Hook Section */}
                    <Box mb={4}>
                      <Typography variant="h6" color="primary" gutterBottom fontWeight="600" sx={{ mb: 2 }}>
                        🎯 Hook
                      </Typography>
                      <Paper 
                        elevation={2} 
                        sx={{ 
                          p: 3, 
                          bgcolor: '#0077B5',
                          color: 'white',
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="h6" fontWeight="600">
                          {result.hook}
                        </Typography>
                      </Paper>
                    </Box>
                    
                    <Divider sx={{ my: 4, borderColor: '#E9E5DF' }} />
                    
                    {/* Content Section */}
                    <Box mb={4}>
                      <Typography variant="h6" color="secondary" gutterBottom fontWeight="600" sx={{ mb: 2 }}>
                        📝 Content
                      </Typography>
                      <Paper 
                        elevation={1} 
                        sx={{ 
                          p: 3, 
                          bgcolor: '#FFFFFF',
                          borderRadius: 2,
                          border: '1px solid #E9E5DF',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            borderColor: '#D6D0C4',
                          },
                        }}
                      >
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            whiteSpace: 'pre-wrap',
                            lineHeight: 1.7,
                            color: 'text.primary',
                          }}
                        >
                          {result.content}
                        </Typography>
                      </Paper>
                    </Box>
                    
                    {/* LinkedIn Preview */}
                    <Box>
                      <Typography variant="h6" color="text.secondary" gutterBottom fontWeight="600" sx={{ mb: 2 }}>
                        📱 LinkedIn Preview
                      </Typography>
                      <Paper 
                        elevation={2} 
                        sx={{ 
                          p: 4, 
                          bgcolor: 'white',
                          borderRadius: 2,
                          border: '2px solid #0077B5',
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                          <Box
                            sx={{
                              p: 1,
                              bgcolor: '#0077B5',
                              borderRadius: 2,
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <LinkedInIcon sx={{ color: 'white', fontSize: 20 }} />
                          </Box>
                          <Typography variant="subtitle1" color="#0077B5" fontWeight="700">
                            LinkedIn Post
                          </Typography>
                        </Stack>
                                                  <Typography 
                            variant="h6" 
                            fontWeight="600" 
                            gutterBottom 
                            component="div"
                            sx={{
                              color: '#000000',
                              fontSize: '16px',
                              lineHeight: 1.5,
                              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                              '& strong': {
                                fontWeight: 600,
                                color: '#000000',
                              },
                            }}
                            dangerouslySetInnerHTML={{ __html: formatLinkedInText(result.hook) }}
                          />
                          <Typography 
                            variant="body1" 
                            component="div"
                            sx={{ 
                              color: '#191919',
                              lineHeight: 1.6,
                              fontSize: '14px',
                              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                              '& strong': {
                                fontWeight: 600,
                                color: '#000000',
                              },
                              '& br': {
                                lineHeight: 1.8,
                              },
                              // Style hashtags like real LinkedIn
                              '& span[style*="color: #0077B5"]': {
                                '&:hover': {
                                  textDecoration: 'underline',
                                },
                              },
                            }}
                            dangerouslySetInnerHTML={{ __html: formatLinkedInText(result.content) }}
                          />
                      </Paper>
                    </Box>
                  </CardContent>
                </Card>
              ) : (
                <Box 
                  display="flex" 
                  flexDirection="column" 
                  alignItems="center" 
                  justifyContent="center" 
                  height="100%"
                  textAlign="center"
                  sx={{ px: 4 }}
                >
                  <Box
                    sx={{
                      p: 4,
                      borderRadius: 3,
                      bgcolor: '#F3F2EF',
                      border: '1px solid #E9E5DF',
                      mb: 3,
                    }}
                  >
                    <AutoFixHighIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                  </Box>
                  <Typography variant="h4" color="text.primary" gutterBottom fontWeight="600">
                    Ready to create amazing content?
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, lineHeight: 1.6 }}>
                    Fill out the form on the left and our AI will craft the perfect LinkedIn post for your audience.
                  </Typography>
                </Box>
              )}
            </Container>
          </Panel>
        </PanelGroup>
      </Box>

      {/* Modern Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          variant="filled"
          sx={{ 
            borderRadius: 2,
            bgcolor: '#0077B5',
          }}
        >
          Post copied to clipboard!
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}