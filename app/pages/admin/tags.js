import { Badge, Box, Button, Flex, Grid, GridItem, Image, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Table, Tbody, Td, Text, Textarea, Th, Thead, Tr, useDisclosure, useToast } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { FaAdjust, FaBook, FaBookMedical, FaBookReader, FaBrain, FaClock, FaEdit, FaGift, FaHeading, FaHeadSideCough, FaHome, FaImage, FaListUl, FaMoneyBill, FaTiktok, FaTimes, FaUser, FaVideo, FaVideoSlash } from 'react-icons/fa'
import { Skeleton, SkeletonText } from '@chakra-ui/react'
import Admin from './index'
import { DeleteIcon } from '@chakra-ui/icons'



export async function getServerSideProps() {
    const res = await fetch('https://images.techrapid.in/tags')
    const { tags } = await res.json()
    return {
        props: {
            data: tags
        }
    }
}



function images({ data }) {
    const [loading, setLoading] = React.useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [query, setQuery] = React.useState('update');
    const toast = useToast();

    const [tag, setTag] = React.useState({ name: '' });
    const [tags, setTags] = React.useState(data);


    const addTag = async () => {
        setLoading(true);
        try {
            const res = await fetch('https://images.techrapid.in/tags', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tag)
            });
            const { tag: data } = await res.json();
            setTags([...tags, data]);
            setLoading(false);
            onClose();
            toast({
                title: "Tag added.",
                description: "We've added the tag for you.",
                status: "success",
                duration: 3000,
                isClosable: true,
            })
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <>
            <Admin>
                <Box bg={'gray.50'}>
                    <Box mx='4'>
                        <Grid templateColumns="repeat(7, 1fr)" gap={6}>
                            <GridItem colSpan={{ base: 7, md: 7 }} h='92vh' overflowY='scroll' pb='8' overflowX='hidden' css={{ '&::-webkit-scrollbar': { display: 'none' } }}>
                                <Box>
                                    <Box p='4' mt='4' borderRadius='lg' bg='white'>
                                        <Flex alignItems='center' gap='2'>
                                            <FaBookReader />
                                            <Text fontSize='2xl' fontWeight='semibold'>Manage Tags</Text>
                                            <Button onClick={() => {
                                                onOpen();
                                                setTag({ name: '', image: '' });
                                                setQuery('add')
                                            }} colorScheme='blue' size='md' ml='auto'>Add Tag</Button>
                                        </Flex>
                                    </Box>
                                    <Box mt='4'>
                                        <Table variant="simple">
                                            <Thead>
                                                <Tr>
                                                    <Th>Tag Name</Th>
                                                    <Th>
                                                        <Flex alignItems='center' justifyContent='flex-end'>
                                                            <Text mr='2'>Actions</Text>
                                                        </Flex>
                                                    </Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {loading ? (
                                                    <Tr>
                                                        <Td>
                                                            <Skeleton height="20px" />
                                                        </Td>
                                                        <Td>
                                                            <Skeleton height="20px" />
                                                        </Td>
                                                    </Tr>
                                                ) : (
                                                    tags.map((tag, index) => (
                                                        <Tr key={index}>
                                                            <Td>{tag.name}</Td>
                                                            <Td>
                                                                <Button onClick={() => {
                                                                    setLoading(true);
                                                                    fetch(`https://images.techrapid.in/tags/${tag._id}`, {
                                                                        method: 'DELETE'
                                                                    }).then(() => {
                                                                        setTags(tags.filter((item) => item._id !== tag._id));
                                                                        setLoading(false);
                                                                        toast({
                                                                            title: "Tag deleted.",
                                                                            description: "We've deleted the tag for you.",
                                                                            status: "error",
                                                                            duration: 3000,
                                                                            isClosable: true,
                                                                        })
                                                                    })
                                                                }} colorScheme='red' size='sm' float={'right'} ml='2'><DeleteIcon /></Button>
                                                            </Td>
                                                        </Tr>
                                                    ))
                                                )}
                                            </Tbody>
                                        </Table>
                                    </Box>
                                </Box>
                            </GridItem>
                        </Grid>
                    </Box>
                </Box>
                <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} size='lg'>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>
                            <Text fontSize='xl' my='3' fontWeight='semibold'>
                                {query === 'add' ? 'Add' : 'Update'} Tag
                            </Text>
                            <InputGroup>
                                <InputLeftElement pointerEvents='none' children={<FaAdjust />} />
                                <Input type='text' placeholder='Tag Name' value={tag.name} onChange={(e) => setTag({ ...tag, name: e.target.value })} />
                            </InputGroup>
                        </ModalHeader>
                        <ModalCloseButton />

                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={onClose}>
                                Close
                            </Button>
                            <Button colorScheme='green' onClick={query === 'add' ? addTag : null}>
                                {query === 'add' ? 'Add' : 'Update'}
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Admin>
        </>
    )
}

export default images;