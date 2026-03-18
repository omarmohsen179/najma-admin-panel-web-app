import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { PictureAsPdf as PdfIcon, Download as DownloadIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { buildFileUrl } from '../utils/reservationHelpers';

const DocumentPdf = React.memo(({ path, label }) => {
  if (!path || path === 'N/A') {
    return (
      <Box sx={{ textAlign: 'center', p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
        <Typography variant="body2" color="textSecondary">No {label}</Typography>
      </Box>
    );
  }

  // Construct the full URL using helper function
  const fullPdfSrc = buildFileUrl(path);
  if (!fullPdfSrc) {
    return (
      <Box sx={{ textAlign: 'center', p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
        <Typography variant="body2" color="textSecondary">No {label}</Typography>
      </Box>
    );
  }
  
  const handleView = () => {
    try {
      // fullPdfSrc is already a full URL from buildFileUrl
      // Handle Arabic characters and special characters in the URL
      // Split the URL to encode only the filename part
      const urlParts = fullPdfSrc.split('/');
      if (urlParts.length > 0) {
        // Encode only the filename (last part) to handle Arabic characters
        const filename = urlParts[urlParts.length - 1];
        urlParts[urlParts.length - 1] = encodeURIComponent(filename);
        const cleanUrl = urlParts.join('/');
        console.log('Opening PDF URL:', cleanUrl);
        window.open(cleanUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.open(fullPdfSrc, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Error opening PDF:', error);
      alert('Unable to open PDF. Please try downloading instead.');
    }
  };

  const handleDownload = () => {
    try {
      // fullPdfSrc is already a full URL from buildFileUrl
      // Handle Arabic characters and special characters in the URL
      const urlParts = fullPdfSrc.split('/');
      let cleanUrl = fullPdfSrc;
      if (urlParts.length > 0) {
        // Encode only the filename (last part) to handle Arabic characters
        const filename = urlParts[urlParts.length - 1];
        urlParts[urlParts.length - 1] = encodeURIComponent(filename);
        cleanUrl = urlParts.join('/');
      }
      
      console.log('Downloading PDF from URL:', cleanUrl);
      
      const link = document.createElement('a');
      link.href = cleanUrl;
      link.download = path.split('/').pop();
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Unable to download PDF. Please check the file path.');
    }
  };

  return (
    <Box sx={{ 
      textAlign: 'center', 
      p: 2, 
      border: '1px solid #ddd', 
      borderRadius: 1,
      '&:hover': { 
        boxShadow: 2,
        transform: 'translateY(-2px)',
        transition: 'all 0.2s ease-in-out'
      }
    }}>
      <PdfIcon sx={{ fontSize: 48, color: '#d32f2f', mb: 1 }} />
      <Typography variant="body2" sx={{ mb: 1, wordBreak: 'break-all', fontSize: '0.75rem' }}>
        {path.split('/').pop()}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ViewIcon />}
          onClick={handleView}
          sx={{ fontSize: '0.7rem', py: 0.5 }}
        >
          View
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          sx={{ fontSize: '0.7rem', py: 0.5 }}
        >
          Download
        </Button>
      </Box>
    </Box>
  );
});

DocumentPdf.displayName = 'DocumentPdf';

export default DocumentPdf;
