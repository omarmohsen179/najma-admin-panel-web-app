import React from 'react';
import { Box, Typography } from '@mui/material';
import { buildFileUrl, showFullScreenImage } from '../utils/reservationHelpers';

const DocumentImage = React.memo(({ path, label }) => {
  if (!path || path === 'N/A') {
    return (
      <Box sx={{ textAlign: 'center', p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
        <Typography variant="body2" color="textSecondary">No {label}</Typography>
      </Box>
    );
  }

  // Construct the full URL using helper function
  const fullImageSrc = buildFileUrl(path);
  if (!fullImageSrc) {
    return (
      <Box sx={{ textAlign: 'center', p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
        <Typography variant="body2" color="textSecondary">No {label}</Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ textAlign: 'center' }}>
      <img
        src={fullImageSrc}
        alt={label}
        style={{
          width: '100%',
          maxWidth: '200px',
          height: '120px',
          objectFit: 'cover',
          borderRadius: '8px',
          border: '1px solid #ddd',
          cursor: 'pointer',
          transition: 'transform 0.2s',
        }}
        onClick={() => showFullScreenImage(fullImageSrc)}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        onError={(e) => {
          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMDAgNjVDMTAyLjIgNjUgMTA0IDYzLjIgMTA0IDYxQzEwNCA1OC44IDEwMi4yIDU3IDEwMCA1N0M5Ny44IDU3IDk2IDU4LjggOTYgNjFDOTYgNjMuMiA5Ny44IDY1IDEwMCA2NVoiIGZpbGw9IiM5OTkiLz4KPHBhdGggZD0iTTc1IDQ1VjgwSDEyNVY0NUg3NVpNMTIwIDc1SDgwVjUwSDEyMFY3NVoiIGZpbGw9IiM5OTkiLz4KPHRleHQgeD0iMTAwIiB5PSI5NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=';
        }}
      />
      <Typography variant="body2" sx={{ mt: 1, wordBreak: 'break-all', fontSize: '0.75rem' }}>
        {path.split('/').pop()}
      </Typography>
    </Box>
  );
});

DocumentImage.displayName = 'DocumentImage';

export default DocumentImage;
