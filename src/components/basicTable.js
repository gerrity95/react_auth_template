import React from 'react'
import MaterialReactTable from 'material-react-table';

const BasicTable = ({columns, data}) => {
    
  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
      <div style={{ height: 200, width: '100%',}}>
      <MaterialReactTable
        columns={columns}
        data={data}
        enableColumnActions={false}
        enableColumnFilters={false}
        enablePagination={false}
        enableSorting={false}
        enableBottomToolbar={false}
        enableTopToolbar={false}
        muiTableBodyRowProps={{ hover: false }}
      />
      </div>
    </div>
  )
}

export default BasicTable