import { Badge, Box, Button, Flex, Grid, GridItem, Image, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Table, Tbody, Td, Text, Textarea, Th, Thead, Tr, useDisclosure, useToast } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { FaAdjust, FaBook, FaBookMedical, FaBookReader, FaBrain, FaClock, FaEdit, FaGift, FaHeading, FaHeadSideCough, FaHome, FaImage, FaListUl, FaMoneyBill, FaTiktok, FaTimes, FaUser, FaVideo, FaVideoSlash } from 'react-icons/fa'
import { Skeleton, SkeletonText } from '@chakra-ui/react'
import Admin from './index'
import { DeleteIcon } from '@chakra-ui/icons'
import { FiCloudOff } from 'react-icons/fi'



export async function getServerSideProps() {
    const res = await fetch('https://images.techrapid.in/color')
    const { colors } = await res.json()
    return {
        props: {
            data: colors
        }
    }
}



function images({ data }) {
    const [loading, setLoading] = React.useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [query, setQuery] = React.useState('update');
    const toast = useToast();

    const [color, setColor] = React.useState({ name: '', code: '', image: [] });
    const [colors, setColors] = React.useState(data);

    const handleImages = (e) => {
        const files = e.target.files;
        const images = [];
        for (let i = 0; i < files.length; i++) {
            images.push(files[i]);
        }
        setColor({ ...color, image: images });
    }



    const addColor = async () => {
        setLoading(true);
        try {
            const res = await fetch('https://images.techrapid.in/color', {
                method: 'POST',
                body: JSON.stringify(color),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const { color: data } = await res.json();
            setColors([...colors, data]);
            setLoading(false);
            onClose();
            toast({
                title: "Color added.",
                description: "We've added the color for you.",
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
                                            <Text fontSize='2xl' fontWeight='semibold'>Manage Colors</Text>
                                            <Button onClick={() => {
                                                onOpen();
                                                setColor({ name: '', image: '' });
                                                setQuery('add')
                                            }} colorScheme='blue' size='md' ml='auto'>Add Color</Button>
                                        </Flex>
                                    </Box>
                                    <Grid templateColumns="repeat(4, 1fr)" gap={6} mt='4'>
                                        {
                                            loading ? new Array(6).fill(6).map((el, index) => <GridItem colSpan={1} key={index} >
                                                <Box borderRadius='lg' boxShadow={'md'} bg='white'>
                                                    <Skeleton roundedTop={'lg'} h={'180px'} />
                                                    <Box p='4'>
                                                        <SkeletonText mt='2' noOfLines={1} spacing='4' />
                                                        <SkeletonText mt='2' noOfLines={1} spacing='4' />
                                                        <SkeletonText mt='2' noOfLines={1} spacing='4' />

                                                    </Box>
                                                </Box>
                                            </GridItem>) : colors.map((color, index) => <GridItem colSpan={1} key={index} >
                                                <Box borderRadius='lg' boxShadow={'md'} bg='white'>
                                                    <Box h={'50px'} bg={color.code} roundedTop={'lg'} />
                                                    <Box p='4'>
                                                        <Flex alignItems='center' gap='2' mt='2'>
                                                            <Text fontSize='xl' fontWeight='semibold'>{color.name}</Text>
                                                            <Flex alignItems='center' gap='2' ml='auto'>
                                                                <Button colorScheme={'blue'} size='sm' onClick={() => {
                                                                    onOpen();
                                                                    setColor(color);
                                                                    setQuery('update')
                                                                }}><FaEdit />
                                                                </Button>
                                                                <Button colorScheme={'red'} size='sm' onClick={() => {
                                                                    setLoading(true);
                                                                    fetch(`https://images.techrapid.in/color/${color._id}`, {
                                                                        method: 'DELETE'
                                                                    }).then(res => res.json()).then(data => {
                                                                        setColors(colors.filter(el => el._id !== color._id));
                                                                        setLoading(false);
                                                                        toast({
                                                                            title: "Color deleted.",
                                                                            description: "We've deleted the color for you.",
                                                                            status: "success",
                                                                            duration: 3000,
                                                                            isClosable: true,
                                                                        })
                                                                    })
                                                                }}><DeleteIcon />
                                                                </Button>
                                                            </Flex>
                                                        </Flex>
                                                    </Box>
                                                </Box>
                                            </GridItem>)
                                        }
                                    </Grid>
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
                                Preview & {query === 'add' ? 'Add' : 'Update'} Image
                            </Text>
                            <InputGroup>
                                <InputLeftElement pointerEvents='none' children={<FaAdjust />} />
                                <Input type='text' placeholder='Color Name' value={color.name} onChange={(e) => setColor({ ...color, name: e.target.value })} />
                            </InputGroup>
                            <InputGroup mt='4'>
                                <InputLeftElement pointerEvents='none' children={<FaImage />} />
                                <Input type='file' placeholder='Color Image' onChange={handleImages} />
                            </InputGroup>
                            <InputGroup mt='4'>
                                <InputLeftElement pointerEvents='none' children={<FiCloudOff />} />
                                <Input type='text' placeholder='Color Code' onChange={(e) => setColor({ ...color, code: e.target.value })} />
                            </InputGroup>
                            <Box mt='4' w='100%' h='50px' bg={color.code} borderRadius='lg' />
                        </ModalHeader>
                        <ModalCloseButton />

                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={onClose}>
                                Close
                            </Button>
                            <Button colorScheme='green' onClick={query === 'add' ? addColor : null}>
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