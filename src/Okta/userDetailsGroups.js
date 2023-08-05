import React, { useMemo } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import MaterialReactTable from 'material-react-table'
import { Box, } from '@mui/material';

const UserDetailsGroups = ({ data }) => {

    //Column definitions pointing to data
    const columns = useMemo(() => [
            {id: 'id', header: 'Id', accessorKey: 'id'},
            {id: 'name', 
                header: 'Name', 
                accessorKey: 'profile.name', 
                enableHiding: false,
                Cell: ({ renderedCellValue, row }) => (
                    <Box sx={{display: 'flex', alignItems: 'center', gap: '1rem', }} >
                      <img alt="avatar" height={25} src={row.original._links.logo[0].href} loading="lazy" style={{ borderRadius: '25%' }} />
                      <span>{renderedCellValue}</span>
                    </Box>
                )
            },
            {id: 'source', header: 'Source', accessorKey: 'sourceName'},
            {id: 'description', header: 'Description', accessorKey: 'profile.description'},
        ],
        [],
    )

    return (
        <Accordion defaultActiveKey="0" alwaysOpen>
            <Accordion.Item eventKey="0">
                <Accordion.Header>Groups</Accordion.Header>
                <Accordion.Body>

                    {data &&
                        <MaterialReactTable
                            columns={columns}
                            data={data}
                            enableRowSelection={false} //turn off a feature
                            enableColumnOrdering={true}
                            enableGlobalFilter={true} 
                            enableFullScreenToggle={false}
                            enableDensityToggle={false}
                            enableStickyHeader={true}
                            enableStickyFooter={true}         
                            muiTableContainerProps={{ sx: { maxHeight: 500 } }}
                            enableGrouping

                            initialState={{
                                columnVisibility: { id: false, description: false },
                                density: 'compact',
                                showGlobalFilter: true,
                                pagination: { pageIndex: 0, pageSize: 50 },
                            }}
                        />
                    }

                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}

export default UserDetailsGroups