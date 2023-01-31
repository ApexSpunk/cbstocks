import { Badge, Box, Button, Flex, Grid, GridItem, Image, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, Textarea, useDisclosure, useToast } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { FaAdjust, FaBook, FaBookMedical, FaBookReader, FaBrain, FaClock, FaEdit, FaGift, FaHeading, FaHeadSideCough, FaHome, FaImage, FaListUl, FaMoneyBill, FaTiktok, FaTimes, FaUser, FaVideo, FaVideoSlash } from 'react-icons/fa'
import { Skeleton, SkeletonText } from '@chakra-ui/react'
import Admin from './index'
import { DeleteIcon } from '@chakra-ui/icons'



export async function getServerSideProps() {
    const res = await fetch('https://cb.techrapid.in/category')
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


    const addCategory = async () => {
        setLoading(true);
        const body = new FormData();
        body.append('name', category.name);
        body.append('image', category.image);
        const res = await fetch('https://cb.techrapid.in/category', {
            method: 'POST',
            body
        });
        const { category } = await res.json();
        setCategories([...categories, category]);
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
                                                setCategory({ title: '', description: '', slug: '', type: 'free', image: '', totalDuration: '', videos: [{ subtitle: '', duration: '', src: '' }] })
                                                setQuery('add')
                                            }} colorScheme='blue' size='md' ml='auto'>Add Category</Button>
                                        </Flex>
                                    </Box>
                                    <Grid templateColumns="repeat(3, 1fr)" gap={6} mt='4'>
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
                                            </GridItem>) : data?.map((category, index) =>
                                                <GridItem colSpan={1} key={index} >
                                                    <Box borderRadius='lg' boxShadow={'md'} bg='white'>
                                                        <Image src={category.path} roundedTop={'lg'} h={'180px'} w='100%' objectFit='cover' />
                                                        <Box p='4'>
                                                            <Flex alignItems='center' justifyContent='space-between'>
                                                                <Flex alignItems='center' gap='2'>
                                                                    <Badge colorScheme='green' mb='2'>
                                                                        Likes: {category.likes}
                                                                    </Badge>
                                                                    <Badge colorScheme='blue' mb='2'>
                                                                        Views: {category.views}
                                                                    </Badge>
                                                                </Flex>
                                                                <Badge colorScheme='orange' mb='2'>
                                                                    Downloads: {category.downloads}
                                                                </Badge>
                                                            </Flex>
                                                            <Text fontSize='md' fontWeight='semibold'>{category.name}</Text>
                                                            <Text fontSize='sm' fontWeight='semibold' color='gray.500'>{category.category}</Text>

                                                            <Flex alignItems='center' mt='4'>
                                                                <Button colorScheme='blue' w='full' leftIcon={<FaEdit />} onClick={() => {
                                                                    setCategory(category);
                                                                    onOpen();
                                                                    setQuery('update')
                                                                }}>
                                                                    Edit
                                                                </Button>
                                                                <Button colorScheme='red' w='full' ml='2' leftIcon={<DeleteIcon />}>
                                                                    Delete
                                                                </Button>
                                                            </Flex>
                                                        </Box>
                                                    </Box>
                                                </GridItem>
                                            )
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
                                <Input type='file' placeholder='Category Image' onChange={(e) => setCategory({ ...category, image: e.target.files[0] })} />
                            </InputGroup>
                        </ModalHeader>
                        <ModalCloseButton />

                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={onClose}>
                                Close
                            </Button>
                            <Button colorScheme='green'>
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