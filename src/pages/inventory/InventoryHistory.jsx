import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Paper,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
} from '@mui/material';
import { 
  Visibility as ViewIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import InventoryService from '../../services/inventoryService';

const statusColors = {
  completed: 'success',
  processing: 'info',
  failed: 'error',
  pending: 'warning',
};

const InventoryHistory = ({ onViewDetails, showSnackbar }) => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const response = await InventoryService.getInventoryUpdates(
        page + 1,
        rowsPerPage
      );
      setUpdates(response.data);
      setTotal(response.pagination?.total || response.data.length);
    } catch (error) {
      console.error('Error fetching inventory updates:', error);
      showSnackbar('Failed to load inventory history', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUpdates();
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    // Implement search logic if needed
  };

  const filteredUpdates = updates.filter(update => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      update.filename?.toLowerCase().includes(searchLower) ||
      update.status?.toLowerCase().includes(searchLower) ||
      (update.processedBy?.name && update.processedBy.name.toLowerCase().includes(searchLower))
    );
  });

  if (loading && updates.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Inventory Update History</Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            size="small"
            placeholder="Search updates..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} disabled={refreshing}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Card variant="outlined">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Filename</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Processed By</TableCell>
                <TableCell>Items Processed</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUpdates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary">
                      {searchTerm ? 'No matching updates found' : 'No inventory updates found'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUpdates.map((update) => (
                  <TableRow key={update._id} hover>
                    <TableCell>
                      {update.createdAt
                        ? format(new Date(update.createdAt), 'PPpp')
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Typography noWrap>{update.filename || 'N/A'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={update.status || 'N/A'}
                        color={statusColors[update.status] || 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {update.processedBy?.name || 'System'}
                    </TableCell>
                    <TableCell>
                      {update.summary?.totalItems || 0} items
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => onViewDetails(update)}
                          color="primary"
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Box>
  );
};

export default InventoryHistory;
