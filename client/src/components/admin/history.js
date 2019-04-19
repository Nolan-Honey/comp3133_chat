import React from "react";
import axios from "axios";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import 'bootstrap/dist/css/bootstrap.css';
import '../../resources/style.css';



const descend=(x, y, orderedBy)=>{
  if (y[orderedBy] < x[orderedBy]) {
    return -1;
  }
  if (y[orderedBy] > x[orderedBy]) {
    return 1;
  }
  return 0;
}

const stableSort=(array, comp)=> {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((x, y) => {
    const orderOf = comp(x[0], y[0]);
    if (orderOf !== 0) return orderOf;
    return x[1] - y[1];
  });
  return stabilizedThis.map(el => el[0]);
}

const getSort=(orderOf, orderedBy)=>{
  return orderOf === 'descend' ? (a, b) => descend(a, b, orderedBy) : (a, b) => -descend(a, b, orderedBy);
}

const historyRows = [
  { id: 'id', numeric: false, disablePadding: true, label: 'ID' },
  { id: 'name', numeric: true, disablePadding: false, label: 'User' },
  { id: 'message', numeric: true, disablePadding: false, label: 'Message' },
  { id: 'room', numeric: true, disablePadding: false, label: 'Room' },
  { id: 'date', numeric: true, disablePadding: false, label: 'Date' },
  { id: 'time', numeric: true, disablePadding: false, label: 'Time' },
];

class HistoryHeader extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;
    return (
      <TableHead className="admin-table">
        <TableRow className="admin-table">
        <TableCell className="admin-table" padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {historyRows.map(
            row => (
              <TableCell
                key={row.id}
                align='right'
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ),
            this,
          )}
        </TableRow>
      </TableHead>
    );
  }
}
HistoryHeader.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  orderOf: PropTypes.string.isRequired,
  orderedBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'dark'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.dark, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

let EnhancedTableToolbar = props => {
  const { numSelected, classes, delId } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    ><div className={classes.title}>
    {numSelected > 0 ? (
      <Typography color="inherit" variant="subtitle1">
        {numSelected} selected
      </Typography>
    ) : (
      <Typography variant="h6" id="tableTitle">
        History Table
      </Typography>
    )}
  </div>
  <div className={classes.spacer} />
  <div className={classes.actions}>
    {numSelected > 0 ? (
      <Tooltip title="Delete">
        <button onClick={delId}>
          <DeleteIcon /></button>
      </Tooltip>
    ) : (
      <Tooltip title="Filter list">
        <IconButton aria-label="Filter list">
          <FilterListIcon />
        </IconButton>
      </Tooltip>
    )}
  </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};
EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);
const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});



class History extends React.Component{
  
  state = {
    orderOf: 'asc',
    orderedBy: 'id',
    selected: [],
    data: [],
    page: 0,
    rowsPerPage: 5,
    visible: false,
    id:''
  };
  componentDidMount(){
    axios.get("http://localhost:5000/api/history")
    .then(hist => {
      this.setState({data: hist.data})
    })
  }  handleRequestSort = (event, property) => {
    const orderedBy = property;
    let orderOf = 'descend';
    if (this.state.orderedBy === property && this.state.orderOf === 'descend') {
      orderOf = 'asc';
    }
    this.setState({ orderOf, orderedBy });
  };
  handleSelectAll = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  }
  handleSelectAll = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };
  handleClick = (event, id, eid) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected, id:eid });
  };
  isSelected = id => this.state.selected.indexOf(id) !== -1;
  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleDelete= (eid) => {
    // Array.prototype.filter returns new array
    // so we aren't mutating state here
    const arrayCopy = this.state.data.filter((row) => {
      return row._id !== eid
    });
    axios.get('http://localhost:5000/api/history/delete/'+eid)
    this.setState({data:arrayCopy,  selected: []})

  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };
  render(){
    const { classes } = this.props;
    const { data, orderOf, orderedBy, id, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    return(
      <Paper className={classes.root}>
        <EnhancedTableToolbar numSelected={selected.length} delId={()=>this.handleDelete(id)}/>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <HistoryHeader
              numSelected={selected.length}
              orderOf={orderOf}
              orderedBy={orderedBy}
              onSelectAll={this.handleSelectAll}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody className="admin-table">
              {stableSort(data, getSort(orderOf, orderedBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((n,i) => {
                  const isSelected = this.isSelected(i);
                  return (
                    <TableRow
                    hover
                    onClick={event => this.handleClick(event, i, n._id)}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={i}
                    selected={isSelected}
                    >
                    <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell align="right" component="th" scope="row" padding="none">
                      {i}
                      </TableCell>
                      <TableCell align="right">{n.nickname}</TableCell>
                      <TableCell align="right">{n.text}</TableCell>
                      <TableCell align="right">{n.room}</TableCell>
                      <TableCell align="right">{n.creationDate}</TableCell>
                      <TableCell align="right">{n.time}</TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                 <TableRow style={{ height: 49 * emptyRows }}>
                   <TableCell colSpan={6} />
                 </TableRow>
               )}
              
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    )
  } 
}
History.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles) (History);