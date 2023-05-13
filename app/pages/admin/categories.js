import { Badge, Box, Button, Flex, Grid, GridItem, Image, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Table, Tbody, Td, Text, Textarea, Th, Thead, Tr, useDisclosure, useToast } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { FaAdjust, FaBook, FaBookMedical, FaBookReader, FaBrain, FaClock, FaEdit, FaGift, FaHeading, FaHeadSideCough, FaHome, FaImage, FaListUl, FaMoneyBill, FaTiktok, FaTimes, FaUser, FaVideo, FaVideoSlash } from 'react-icons/fa'
import { Skeleton, SkeletonText } from '@chakra-ui/react'
import Admin from './index'
import { DeleteIcon } from '@chakra-ui/icons'



export async function getServerSideProps() {
    const res = await fetch('https://images.techrapid.in/category')
    const { categories } = await res.json()
    return {
        props: {
            data: categories
        }
    }
}



function images({ data }) {
    const [loading, setLoading] = React.useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [query, setQuery] = React.useState('update');
    const toast = useToast();

    const [category, setCategory] = React.useState({ name: '', image: '' });
    const [categories, setCategories] = React.useState(data);

    const handleImages = (e) => {
        const files = e.target.files;
        const images = [];
        for (let i = 0; i < files.length; i++) {
            images.push(files[i]);
        }
        setCategory({ ...category, image: images });
    }


    const addCategory = async () => {
        setLoading(true);
        const body = new FormData();
        body.append('name', category.name);
        category.image.map(image => body.append('image', image));
        const res = await fetch('https://images.techrapid.incategory', {
            method: 'POST',
            body
        });
        const { category: data } = await res.json();
        setCategories([...categories, data]);
        setLoading(false);
        onClose();
        toast({
            title: "Category added.",
            description: "We've added the category for you.",
            status: "success",
            duration: 3000,
            isClosable: true,
        })
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
                                            <Text fontSize='2xl' fontWeight='semibold'>Manage Categories</Text>
                                            <Button onClick={() => {
                                                onOpen();
                                                setCategory({ name: '', image: '' });
                                                setQuery('add')
                                            }} colorScheme='blue' size='md' ml='auto'>Add Category</Button>
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
                                            </GridItem>) : categories.map((category, index) => <GridItem colSpan={1} key={index} >
                                                <Box borderRadius='lg' boxShadow={'md'} bg='white'>
                                                    <Grid templateColumns="repeat(2, 1fr)" gap={1}>
                                                        <Image src={`https://images.techrapid.in/image/${category.image[0]}`} roundedTop={'lg'} w='100%' objectFit='cover' />
                                                    </Grid>
                                                    <Box p='4'>
                                                        <Flex alignItems='center' gap='2' mt='2'>
                                                            <Text fontSize='xl' fontWeight='semibold'>{category.name}</Text>
                                                            <Flex alignItems='center' gap='2' ml='auto'>
                                                                <Button colorScheme={'blue'} size='sm' onClick={() => {
                                                                    onOpen();
                                                                    setCategory(category);
                                                                    setQuery('update')
                                                                }}><FaEdit />
                                                                </Button>
                                                                <Button colorScheme={'red'} size='sm' onClick={() => {
                                                                    setLoading(true);
                                                                    fetch(`https://images.techrapid.in/category/${category._id}`, {
                                                                        method: 'DELETE'
                                                                    }).then(res => res.json()).then(data => {
                                                                        setCategories(categories.filter(el => el._id !== category._id));
                                                                        setLoading(false);
                                                                        toast({
                                                                            title: "Category deleted.",
                                                                            description: "We've deleted the category for you.",
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
                                <Input type='text' placeholder='Category Name' value={category.name} onChange={(e) => setCategory({ ...category, name: e.target.value })} />
                            </InputGroup>
                            <InputGroup mt='4'>
                                <InputLeftElement pointerEvents='none' children={<FaImage />} />
                                <Input type='file' placeholder='Category Image' multiple onChange={handleImages} />
                            </InputGroup>
                        </ModalHeader>
                        <ModalCloseButton />

                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={onClose}>
                                Close
                            </Button>
                            <Button colorScheme='green' onClick={query === 'add' ? addCategory : null}>
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