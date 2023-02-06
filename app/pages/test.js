import { Box, Button } from '@chakra-ui/react'
import React from 'react'

function test() {
    function close_window() {
        close();
    }
    return (
        <Box>
            <Button colorScheme="teal" variant="outline" onClick={() => close_window()}>
                Button
            </Button>
        </Box>
    )
}

export default test