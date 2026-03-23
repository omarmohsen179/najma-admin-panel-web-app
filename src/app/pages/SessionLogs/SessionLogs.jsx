import CrudMUI from "app/components/CrudTable/CrudMUI";
import PageLayout from "app/components/PageLayout/PageLayout";
import { useMemo, useState } from "react";
import { GET_SESSION_LOGS, GET_SESSION_ANALYTICS, GET_USER_STATS } from "./Api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Chip,
  Box,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import {
  Analytics as AnalyticsIcon,
  Person as PersonIcon,
  Place as PlaceIcon,
  Launch as LaunchIcon,
} from "@mui/icons-material";

const SessionLogs = () => {
  const [selectedSession, setSelectedSession] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [userStatsOpen, setUserStatsOpen] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [feedbacksOpen, setFeedbacksOpen] = useState(false);
  const [feedbackSession, setFeedbackSession] = useState(null);

  const handleDetailsClick = (row) => {
    setSelectedSession(row);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedSession(null);
  };

  const handleAnalyticsClick = async () => {
    try {
      const response = await GET_SESSION_ANALYTICS({});
      setAnalytics(response.data);
      setAnalyticsOpen(true);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      alert("Failed to fetch analytics data");
    }
  };

  const handleCloseAnalytics = () => {
    setAnalyticsOpen(false);
    setAnalytics(null);
  };

  const handleUserStatsClick = async (row) => {
    try {
      const response = await GET_USER_STATS(row.UserId);
      setUserStats(response.data);
      setUserStatsOpen(true);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      alert("Failed to fetch user statistics");
    }
  };

  const handleCloseUserStats = () => {
    setUserStatsOpen(false);
    setUserStats(null);
  };

  const handleFeedbacksClick = (session) => {
    setFeedbackSession(session);
    setFeedbacksOpen(true);
  };

  const handleCloseFeedbacks = () => {
    setFeedbacksOpen(false);
    setFeedbackSession(null);
  };

  const getSessionTypeColor = (type) => {
    switch (type) {
      case 0:
        return "primary"; // Orientation
      case 1:
        return "secondary"; // Meeting
      default:
        return "default";
    }
  };

  const getSessionTypeText = (type) => {
    switch (type) {
      case 0:
        return "Orientation";
      case 1:
        return "Meeting";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return "warning"; // Started
      case 1:
        return "success"; // Ended
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Started";
      case 1:
        return "Ended";
      default:
        return "Unknown";
    }
  };

  const getGoogleMapsUrl = (latitude, longitude) => {
    if (latitude == null || longitude == null) return null;
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  };

  const formatDuration = (duration) => {
    if (!duration) return "N/A";

    // Duration is in format "HH:MM:SS.FFFFFF"
    const parts = duration.split(":");
    if (parts.length >= 3) {
      const hours = parseInt(parts[0]);
      const minutes = parseInt(parts[1]);
      const seconds = Math.floor(parseFloat(parts[2]));

      if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
      } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
      } else {
        return `${seconds}s`;
      }
    }
    return duration;
  };

  const mainColumnAttributes = useMemo(() => {
    return [
      {
        caption: "ID",
        captionEn: "ID",
        field: "Id",
        required: false,
        disable: true,
        type: "number",
      },
      {
        caption: "User",
        captionEn: "User",
        field: "UserFullName",
        required: true,
      },
      {
        caption: "Session Type",
        captionEn: "Session Type",
        field: "SessionType",
        required: true,
        type: "select",
        data: [
          { Id: 0, CategoryName: "Orientation" },
          { Id: 1, CategoryName: "Meeting" },
        ],
        value: "Id",
        display: "CategoryName",
        disable: true,
        render: (value) => (
          <Chip
            label={getSessionTypeText(value)}
            color={getSessionTypeColor(value)}
            size="small"
          />
        ),
      },
      {
        caption: "Status",
        captionEn: "Status",
        field: "Status",
        required: true,
        type: "select",
        data: [
          { Id: 0, CategoryName: "Started" },
          { Id: 1, CategoryName: "Ended" },
        ],
        value: "Id",
        display: "CategoryName",
        disable: true,
        render: (value) => (
          <Chip
            label={getStatusText(value)}
            color={getStatusColor(value)}
            size="small"
          />
        ),
      },
      // {
      //   caption: "Latitude",
      //   captionEn: "Latitude",
      //   field: "Latitude",
      //   cellRender: ({ data, value }) => {
      //     if (value == null) {
      //       return <Typography variant="body2">N/A</Typography>;
      //     }
      //     const mapsUrl = getGoogleMapsUrl(value, data?.Longitude);
      //     if (!mapsUrl) {
      //       return <Typography variant="body2">{value}</Typography>;
      //     }
      //     return (
      //       <Box
      //         component="a"
      //         href={mapsUrl}
      //         target="_blank"
      //         rel="noopener noreferrer"
      //         onClick={(event) => event.stopPropagation()}
      //         sx={{
      //           display: "flex",
      //           alignItems: "center",
      //           gap: 1,
      //           textDecoration: "none",
      //           color: "inherit",
      //           width: "100%",
      //           cursor: "pointer",
      //         }}
      //       >
      //         <Typography variant="body2">{value}</Typography>
      //         <LaunchIcon fontSize="small" />
      //       </Box>
      //     );
      //   }
      // },
      // {
      //   caption: "Longitude",
      //   captionEn: "Longitude",
      //   field: "Longitude",
      //   cellRender: ({ data, value }) => {
      //     if (value == null) {
      //       return <Typography variant="body2">N/A</Typography>;
      //     }
      //     const mapsUrl = getGoogleMapsUrl(data?.Latitude, value);
      //     if (!mapsUrl) {
      //       return <Typography variant="body2">{value}</Typography>;
      //     }
      //     return (
      //       <Box
      //         component="a"
      //         href={mapsUrl}
      //         target="_blank"
      //         rel="noopener noreferrer"
      //         onClick={(event) => event.stopPropagation()}
      //         sx={{
      //           display: "flex",
      //           alignItems: "center",
      //           gap: 1,
      //           textDecoration: "none",
      //           color: "inherit",
      //           width: "100%",
      //           cursor: "pointer",
      //         }}
      //       >
      //         <Typography variant="body2">{value}</Typography>
      //         <LaunchIcon fontSize="small" />
      //       </Box>
      //     );
      //   }
      // },
      {
        caption: "Location Address",
        captionEn: "Location Address",
        field: "LocationAddress",
        cellRender: ({ data, value }) => {
          if (!value) {
            return (
              <Typography variant="body2" color="text.primary">
                N/A
              </Typography>
            );
          }
          const mapsUrl = getGoogleMapsUrl(data?.Latitude, data?.Longitude);
          if (!mapsUrl) {
            return (
              <Typography variant="body2" color="text.primary">
                {value}
              </Typography>
            );
          }
          return (
            <Box
              component="a"
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                textDecoration: "none",
                color: (theme) => theme.palette.text.primary,
                "&:hover": {
                  color: (theme) => theme.palette.text.primary,
                },
                width: "100%",
                cursor: "pointer",
              }}
            >
              <Typography
                variant="body2"
                color="text.primary"
                sx={{ whiteSpace: "normal" }}
              >
                {value}
              </Typography>
              <LaunchIcon fontSize="small" />
            </Box>
          );
        },
      },
      {
        caption: "Client Name",
        captionEn: "Client Name",
        field: "ClientName",
      },
      {
        caption: "Broker",
        captionEn: "Broker",
        field: "BrokerName",
        cellRender: ({ value }) => (
          <Typography variant="body2" color="text.primary">
            {value || "—"}
          </Typography>
        ),
      },
      {
        caption: "Start Time",
        captionEn: "Start Time",
        field: "StartTime",
        type: "datetime",
        render: (value) => (value ? new Date(value).toLocaleString() : "N/A"),
      },
      {
        caption: "Duration",
        captionEn: "Duration",
        field: "Duration",
        cellRender:({ data, value }) => {
          return (
            <Typography variant="body2" color="text.primary">
              {formatDuration(value)}
            </Typography>
          );
        },
      },
    ];
  }, []);

  const feedbackColumnAttributes = useMemo(
    () => [
      {
        caption: "ID",
        captionEn: "ID",
        field: "Id",
        type: "number",
        disable: true,
      },
      {
        caption: "Email",
        captionEn: "Email",
        field: "Email",
      },
      {
        caption: "Phone Number",
        captionEn: "Phone Number",
        field: "PhoneNumber",
      },
      {
        caption: "Feedback",
        captionEn: "Feedback",
        field: "Feedback",
        widthRatio: 250,
      },
      {
        caption: "Interested",
        captionEn: "Interested",
        field: "IsInterested",
        render: (value) => (
          <Chip
            label={value ? "Yes" : "No"}
            color={value ? "success" : "default"}
            size="small"
          />
        ),
      },
      {
        caption: "Created At",
        captionEn: "Created At",
        field: "CreatedAt",
        type: "datetime",
        render: (value) => (value ? new Date(value).toLocaleString() : "N/A"),
      },
    ],
    []
  );

  const feedbackGetter = useMemo(() => {
    const data = feedbackSession?.OrientationFeedbacks ?? [];

    return async (params = {}) => {
      // MasterTable sends 1-based PageIndex; convert to 0-based for slice
      const pageIndex = Math.max(0, (params.PageIndex ?? 1) - 1);
      const pageSize = params.PageSize ?? (data.length || 1);
      const start = pageIndex * pageSize;
      const end = start + pageSize;
      const pageData = data.slice(start, end);

      return {
        Data: pageData,
        TotalCount: data.length,
      };
    };
  }, [feedbackSession]);

  const renderDetailsDialog = () => {
    if (!selectedSession) return null;

    return (
      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Session Details - ID: {selectedSession.Id}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Session Information
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle2" color="textSecondary">
                User ID
              </Typography>
              <Typography variant="body1">{selectedSession.UserId}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle2" color="textSecondary">
                User Name
              </Typography>
              <Typography variant="body1">
                {selectedSession.UserFullName}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Session Type
              </Typography>
              <Chip
                label={getSessionTypeText(selectedSession.SessionType)}
                color={getSessionTypeColor(selectedSession.SessionType)}
                size="small"
              />
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Status
              </Typography>
              <Chip
                label={getStatusText(selectedSession.Status)}
                color={getStatusColor(selectedSession.Status)}
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Timing Information
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Start Time
              </Typography>
              <Typography variant="body1">
                {selectedSession.StartTime
                  ? new Date(selectedSession.StartTime).toLocaleString()
                  : "N/A"}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle2" color="textSecondary">
                End Time
              </Typography>
              <Typography variant="body1">
                {selectedSession.EndTime
                  ? new Date(selectedSession.EndTime).toLocaleString()
                  : "N/A"}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary">
                Duration
              </Typography>
              <Typography variant="body1">
                {formatDuration(selectedSession.Duration)}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Location Information
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary">
                Location Address
              </Typography>
              <Typography variant="body1">
                {selectedSession.LocationAddress || "N/A"}
              </Typography>
              {getGoogleMapsUrl(
                selectedSession.Latitude,
                selectedSession.Longitude
              ) && (
                <Box sx={{ mt: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    startIcon={<LaunchIcon fontSize="small" />}
                    component="a"
                    href={getGoogleMapsUrl(
                      selectedSession.Latitude,
                      selectedSession.Longitude
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Maps
                  </Button>
                </Box>
              )}
            </Grid>
            {selectedSession.ClientEmail && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Client Information
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Client Name
                  </Typography>
                  <Typography variant="body1">
                    {selectedSession.ClientName || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Client Email
                  </Typography>
                  <Typography variant="body1">
                    {selectedSession.ClientEmail || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Client Phone
                  </Typography>
                  <Typography variant="body1">
                    {selectedSession.ClientPhoneNumber || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Created Client User ID
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ wordBreak: "break-all", fontSize: "0.8rem" }}
                  >
                    {selectedSession.CreatedClientUserId || "N/A"}
                  </Typography>
                </Grid>
              </>
            )}
            {/* 
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">Created Client User Name</Typography>
                <Typography variant="body1">{selectedSession.CreatedClientUserName || 'N/A'}</Typography>
              </Grid>
              */}

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                System Information
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Created At
              </Typography>
              <Typography variant="body1">
                {selectedSession.CreatedAt
                  ? new Date(selectedSession.CreatedAt).toLocaleString()
                  : "N/A"}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Updated At
              </Typography>
              <Typography variant="body1">
                {selectedSession.UpdatedAt
                  ? new Date(selectedSession.UpdatedAt).toLocaleString()
                  : "N/A"}
              </Typography>
            </Grid>

            {/* Session Feedback */}
            {selectedSession.SessionFeedback && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
                    Session Feedback
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Overall Rating</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {[1,2,3,4,5].map(i => (
                      <span key={i} style={{ color: i <= selectedSession.SessionFeedback.Rating ? '#f5a623' : '#ddd', fontSize: '1.2rem' }}>★</span>
                    ))}
                    <Typography variant="body2" sx={{ ml: 0.5 }}>
                      ({selectedSession.SessionFeedback.Rating}/5)
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Client Satisfaction</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {[1,2,3,4,5].map(i => (
                      <span key={i} style={{ color: i <= selectedSession.SessionFeedback.ClientSatisfaction ? '#f5a623' : '#ddd', fontSize: '1.2rem' }}>👍</span>
                    ))}
                    <Typography variant="body2" sx={{ ml: 0.5 }}>
                      ({selectedSession.SessionFeedback.ClientSatisfaction}/5)
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Detailed Feedback</Typography>
                  <Typography variant="body1">{selectedSession.SessionFeedback.Content || "N/A"}</Typography>
                </Grid>

                {selectedSession.SessionFeedback.Notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Session Notes</Typography>
                    <Typography variant="body1">{selectedSession.SessionFeedback.Notes}</Typography>
                  </Grid>
                )}

                {selectedSession.SessionFeedback.LeadStatus != null && (
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">Lead Status</Typography>
                    <Chip
                      label={selectedSession.SessionFeedback.LeadStatus === 0 ? 'Interested' : selectedSession.SessionFeedback.LeadStatus === 1 ? 'Not Interested' : 'Call Him Back'}
                      color={selectedSession.SessionFeedback.LeadStatus === 0 ? 'success' : selectedSession.SessionFeedback.LeadStatus === 1 ? 'error' : 'warning'}
                      size="small"
                    />
                  </Grid>
                )}

                {selectedSession.SessionFeedback.ClientNote && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Client Note</Typography>
                    <Typography variant="body1">{selectedSession.SessionFeedback.ClientNote}</Typography>
                  </Grid>
                )}

                {selectedSession.SessionFeedback.Outcome && (
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">Outcome</Typography>
                    <Typography variant="body1">{selectedSession.SessionFeedback.Outcome}</Typography>
                  </Grid>
                )}
              </>
            )}

            {!selectedSession.SessionFeedback && selectedSession.Status === 1 && (
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                  No feedback submitted for this session.
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          {selectedSession && (
            <Button
              onClick={() => handleFeedbacksClick(selectedSession)}
              color="primary"
              variant="outlined"
              startIcon={<AnalyticsIcon fontSize="small" />}
            >
              View Orientation Feedbacks
            </Button>
          )}
          {selectedSession && (
            <Button
              onClick={() => handleUserStatsClick(selectedSession)}
              color="primary"
              variant="outlined"
              startIcon={<PersonIcon fontSize="small" />}
            >
              View User Stats
            </Button>
          )}
          <Button onClick={handleCloseDetails} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderAnalyticsDialog = () => {
    if (!analytics) return null;

    return (
      <Dialog
        open={analyticsOpen}
        onClose={handleCloseAnalytics}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AnalyticsIcon />
            Session Analytics Dashboard
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                color="textSecondary"
                gutterBottom
              >
                Period:{" "}
                {analytics.fromDate
                  ? new Date(analytics.fromDate).toLocaleDateString()
                  : "All time"}{" "}
                -{" "}
                {analytics.toDate
                  ? new Date(analytics.toDate).toLocaleDateString()
                  : "Present"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    👥 User Statistics
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {analytics.totalUsers}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Active Users
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="secondary">
                    📚 Orientation Sessions
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Total:</Typography>
                    <Typography variant="h6">
                      {analytics.totalOrientationSessions}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Completed:</Typography>
                    <Typography variant="body1" color="success.main">
                      {analytics.completedOrientationSessions}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2">Active:</Typography>
                    <Typography variant="body1" color="warning.main">
                      {analytics.activeOrientationSessions}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="info.main">
                    🤝 Meeting Sessions
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Total:</Typography>
                    <Typography variant="h6">
                      {analytics.totalMeetingSessions}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Completed:</Typography>
                    <Typography variant="body1" color="success.main">
                      {analytics.completedMeetingSessions}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2">Active:</Typography>
                    <Typography variant="body1" color="warning.main">
                      {analytics.activeMeetingSessions}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="success.main">
                    ⏱️ Average Duration
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Orientation:</Typography>
                    <Typography variant="body1">
                      {formatDuration(analytics.averageOrientationDuration)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2">Meeting:</Typography>
                    <Typography variant="body1">
                      {formatDuration(analytics.averageMeetingDuration)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="warning.main">
                    💬 Feedback Count
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Orientation:</Typography>
                    <Typography variant="body1">
                      {analytics.totalOrientationFeedbacks}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2">Meeting:</Typography>
                    <Typography variant="body1">
                      {analytics.totalMeetingFeedbacks}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAnalytics} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderUserStatsDialog = () => {
    if (!userStats) return null;

    return (
      <Dialog
        open={userStatsOpen}
        onClose={handleCloseUserStats}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PersonIcon />
            User Statistics: {userStats.userFullName}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                color="textSecondary"
                gutterBottom
              >
                User ID: {userStats.userId}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    📚 Orientations
                  </Typography>
                  <Typography variant="body2">
                    Total: {userStats.totalOrientationSessions}
                  </Typography>
                  <Typography variant="body2">
                    Completed: {userStats.completedOrientationSessions}
                  </Typography>
                  <Typography variant="body2">
                    Active: {userStats.activeOrientationSessions}
                  </Typography>
                  <Typography variant="body2">
                    Feedbacks: {userStats.orientationFeedbackCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" color="secondary" gutterBottom>
                    🤝 Meetings
                  </Typography>
                  <Typography variant="body2">
                    Total: {userStats.totalMeetingSessions}
                  </Typography>
                  <Typography variant="body2">
                    Completed: {userStats.completedMeetingSessions}
                  </Typography>
                  <Typography variant="body2">
                    Active: {userStats.activeMeetingSessions}
                  </Typography>
                  <Typography variant="body2">
                    Feedbacks: {userStats.meetingFeedbackCount}
                  </Typography>
                  <Typography variant="body2">
                    Session Feedbacks: {userStats.sessionFeedbackCount ?? 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Total Session Time
              </Typography>
              <Typography variant="h6" color="success.main">
                {formatDuration(userStats.totalSessionTime)}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Average Duration
              </Typography>
              <Typography variant="h6" color="info.main">
                {formatDuration(userStats.averageSessionDuration)}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUserStats} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderFeedbacksDialog = () => {
    if (!feedbackSession) return null;

    return (
      <Dialog
        open={feedbacksOpen}
        onClose={handleCloseFeedbacks}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Orientation Feedbacks - Session ID: {feedbackSession.Id}
        </DialogTitle>
        <DialogContent>
          <CrudMUI
            id={"Id"}
            colAttributes={feedbackColumnAttributes}
            view={true}
            GET={feedbackGetter}
            apiKey={"Id"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFeedbacks} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <PageLayout>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AnalyticsIcon />}
          onClick={handleAnalyticsClick}
          sx={{ mr: 2 }}
        >
          View Analytics
        </Button>
      </Box>

      <CrudMUI
        id={"Id"}
        colAttributes={[
          ...mainColumnAttributes,
          {
            caption: "Details",
            captionEn: "Details",
            field: "details",
            type: "buttons",
            widthRatio: 100,
            func: (row) => handleDetailsClick(row),
            text: "View Details",
            icon: "info",
          },
          //   {
          //     caption: "User Stats",
          //     captionEn: "User Stats",
          //     field: "userStats",
          //     type: "buttons",
          //     widthRatio: 110,
          //     func: (row) => handleUserStatsClick(row),
          //     text: "User Stats",
          //     icon: "person"
          //   }
        ]}
        view={true}
        GET={GET_SESSION_LOGS}
        apiKey={"Id"}
      />
      {renderDetailsDialog()}
      {renderAnalyticsDialog()}
      {renderUserStatsDialog()}
      {renderFeedbacksDialog()}
    </PageLayout>
  );
};

export default SessionLogs;
