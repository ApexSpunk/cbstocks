import { Badge, Box, Button, Flex, Grid, GridItem, Image, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, Textarea, useDisclosure, useToast } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { FaAdjust, FaBook, FaBookMedical, FaBookReader, FaBrain, FaClock, FaCocktail, FaEdit, FaGift, FaHeading, FaHeadSideCough, FaHome, FaImage, FaImages, FaListUl, FaMoneyBill, FaTiktok, FaTimes, FaUser, FaVideo, FaVideoSlash } from 'react-icons/fa'
import { Skeleton, SkeletonText } from '@chakra-ui/react'
import Admin from './index'
import { DeleteIcon } from '@chakra-ui/icons'


export async function getServerSideProps() {
    const res = await fetch('https://images.techrapid.in/images?limit=30')
    const cate = await fetch('https://images.techrapid.in/category')
    const tag = await fetch('https://images.techrapid.in/tags')
    const colo = await fetch('https://images.techrapid.in/color')
    const { images } = await res.json()
    const { categories } = await cate.json()
    const { tags } = await tag.json()
    const { colors } = await colo.json()
    return {
        props: { images, categories, tags, colors }
    }
}



function images({ images, categories, tags, colors }) {
    const [loading, setLoading] = React.useState(false);
    const [data, setData] = React.useState(images);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [query, setQuery] = React.useState('update');
    const [page, setPage] = React.useState(1);
    const toast = useToast();
    var token = null;


    if (typeof window !== "undefined") {
        token = localStorage.getItem('token')
        if (!token) {
            window.location.href = '/'
        }
    }


    const [course, setCourse] = React.useState({ name: '', images: [], category: '', tags: [], colors: [], description: '', keywords: [] });

    const handleDelete = async (id) => {
        setLoading(true)
        const res = fetch(`https://images.techrapid.in/images/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                token
            }
        })
        const { success } = await res.then(res => res.json())
        if (success) {
            toast({
                title: "Image deleted.",
                description: "We've deleted the image for you.",
                status: "success",
                duration: 3000,
                isClosable: true,
            })
            setLoading(false)
        } else {
            toast({
                title: "An error occurred.",
                description: "We're unable to delete the image at this time.",
                status: "error",
                duration: 3000,
                isClosable: true,
            })
            setLoading(false)
        }
        setData(data.filter(item => item._id !== id))
    }


    const handleImages = (e) => {
        const files = e.target.files;
        const images = [];
        for (let i = 0; i < files.length; i++) {
            images.push(files[i]);
        }
        setCourse({ ...course, images });
    }

    const addImage = async () => {
        setLoading(true);
        const body = new FormData();
        body.append('title', course.name);
        course.images.forEach(image => {
            body.append('images', image);
        });
        body.append('category', course.category);
        course.tags.forEach(tag => {
            body.append('tags', tag);
        });
        course.colors.forEach(color => {
            body.append('colors', color);
        });
        body.append('keywords', course.keywords);
        body.append('description', course.description);
        const res = await fetch('https://images.techrapid.in/images/upload', {
            method: 'POST',
            headers: {
                token
            },
            body
        })
        const { success, images: imgs } = await res.json()
        if (success) {
            toast({
                title: "Image added.",
                description: "We've added the image for you.",
                status: "success",
                duration: 3000,
                isClosable: true,
            })
            setLoading(false)
        } else {
            toast({
                title: "An error occurred.",
                description: "We're unable to add the image at this time.",
                status: "error",
                duration: 3000,
                isClosable: true,
            })
            setLoading(false)
        }
        setData([...data, ...imgs])
    }

    const fetchByCategory = async (category) => {
        setLoading(true)
        const res = await fetch(`https://images.techrapid.in/images?category=${category}&limit=30`)
        const { images } = await res.json()
        setData(images)
        setLoading(false)
    }

    const loadMore = async () => {
        setLoading(true)
        const res = await fetch(`https://images.techrapid.in/images?page=${page + 1}&limit=30`)
        const { images } = await res.json()
        setData([...data, ...images])
        setPage(page + 1)
        setLoading(false)
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
                                            <Text fontSize='2xl' fontWeight='semibold'>Manage Images</Text>
                                            <Button onClick={() => {
                                                onOpen();
                                                setCourse({ name: '', images: [], category: '', tags: [], colors: [] });
                                                setQuery('add')
                                            }} colorScheme='blue' size='md' ml='auto'>Add Image</Button>
                                        </Flex>
                                        <Select placeholder='Select Category' mt='4' onChange={(e) => fetchByCategory(e.target.value)}>
                                            {
                                                categories.map((category, index) => <option key={index} value={category._id}>{category.name}</option>)
                                            }
                                        </Select>
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
                                            </GridItem>) : data?.map((course, index) =>
                                                <GridItem colSpan={1} key={index} >
                                                    <Box borderRadius='lg' boxShadow={'md'} bg='white'>
                                                        <a href={`https://techrapid.in//${course.slug}`} target='_blank'>
                                                            <Image src={course.image.url + "?width=100"} roundedTop={'lg'} h={'180px'} w='100%' objectFit='cover' />
                                                        </a>
                                                        <Box p='4'>
                                                            <Flex alignItems='center' justifyContent='space-between'>
                                                                <Flex alignItems='center' gap='2'>
                                                                    <Badge colorScheme='green' mb='2'>
                                                                        Likes: {course.likes}
                                                                    </Badge>
                                                                    <Badge colorScheme='blue' mb='2'>
                                                                        Views: {course.views}
                                                                    </Badge>
                                                                </Flex>
                                                                <Badge colorScheme='orange' mb='2'>
                                                                    Downloads: {course.downloads}
                                                                </Badge>
                                                            </Flex>
                                                            <Text fontSize='md' fontWeight='semibold'>{course.name}</Text>
                                                            <Flex alignItems='center' gap='2' flexWrap='wrap' justifyContent='space-between'>
                                                                <Text fontSize='sm' fontWeight='semibold' color='gray.500'>Category: {course?.category?.name}</Text>
                                                                <Flex alignItems='center' gap='2'>
                                                                    {
                                                                        course.colors.map((color, index) => <Box key={index} w='20px' h='20px' borderRadius='full' bg={color.code} />)
                                                                    }
                                                                </Flex>
                                                            </Flex>
                                                            <Flex mt='4' alignItems='center' flexWrap='wrap' columnGap='2'>
                                                                {
                                                                    course.tags.slice(0, 2).map((tag, index) => <Badge key={index} colorScheme='green' mb='2'>
                                                                        {tag.name}
                                                                    </Badge>)
                                                                }
                                                            </Flex>

                                                            <Flex alignItems='center' mt='4'>
                                                                {/* <Button colorScheme='blue' w='full' leftIcon={<FaEdit />} onClick={() => {
                                                                    setCourse(course);
                                                                    onOpen();
                                                                    setQuery('update')
                                                                }}>
                                                                    Edit
                                                                </Button> */}
                                                                <Button colorScheme='red' w='full' ml='2' leftIcon={<DeleteIcon />} onClick={() => handleDelete(course._id)}>
                                                                    Delete
                                                                </Button>
                                                            </Flex>
                                                        </Box>
                                                    </Box>
                                                </GridItem>
                                            )
                                        }
                                    </Grid>
                                    <Box mt='4' mb='8'>
                                        <Button colorScheme='blue' w='full' onClick={loadMore}>Load More</Button>
                                    </Box>
                                </Box>
                            </GridItem>
                        </Grid>
                    </Box>
                </Box>
                <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} size='2xl'>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>
                            <Text fontSize='xl' my='3' fontWeight='semibold'>
                                Preview & {query === 'add' ? 'Add' : 'Update'} Image
                            </Text>
                            <Box>
                                <InputGroup>
                                    <InputLeftElement pointerEvents='none' children={<FaAdjust />} />
                                    <Input type='text' placeholder='Image Name' value={course.name} onChange={(e) => setCourse({ ...course, name: e.target.value })} />
                                </InputGroup>
                                <InputGroup mt='4'>
                                    <InputLeftElement pointerEvents='none' />
                                    <Textarea placeholder='Description' value={course.description} onChange={(e) => setCourse({ ...course, description: e.target.value })} />
                                </InputGroup>
                                <InputGroup mt='4'>
                                    <Select placeholder='Select Category' value={course.category} onChange={(e) => setCourse({ ...course, category: e.target.value })}>
                                        {
                                            categories.map((category, index) => <option key={index} value={category._id}>{category.name}</option>)
                                        }
                                    </Select>
                                </InputGroup>
                                <InputGroup mt='4'>
                                    <InputLeftElement pointerEvents='none' children={<FaImages />} />
                                    <Input type='file' placeholder='Select Images' accept='image/*' multiple onChange={handleImages} />
                                </InputGroup>
                                <InputGroup mt='4'>
                                    <Select placeholder='Select Colors' onChange={(e) => course.colors.includes(e.target.value) ? null : setCourse({ ...course, colors: [...course.colors, e.target.value] })}>
                                        {
                                            colors.map((color, index) => <option key={index} value={color._id}>{color.name}</option>)
                                        }
                                    </Select>
                                </InputGroup>
                                <InputGroup mt='4'>
                                    <Select placeholder='Select Tags' onChange={(e) => course.tags.includes(e.target.value) ? null : setCourse({ ...course, tags: [...course.tags, e.target.value] })}>
                                        {
                                            tags.map((tag, index) => <option key={index} value={tag._id}>{tag.name}</option>)
                                        }
                                    </Select>
                                </InputGroup>
                                <InputGroup mt='4'>
                                    <InputLeftElement pointerEvents='none' children={<FaListUl />} />
                                    <Input type='text' placeholder='Keywords' value={course.keywords} onChange={(e) => setCourse({ ...course, keywords: e.target.value.split(',') })} />
                                </InputGroup>
                                {
                                    course.colors && course.colors.length > 0 && <Flex mt='4' alignItems='center' gap='2'>
                                        <Text fontSize='md' fontWeight='semibold'>Colors:</Text>
                                        {
                                            course.colors.map((color, index) => <Box key={index} w='10' h='10' borderRadius='full' bg={colors.find((el) => el._id === color).code} />)
                                        }
                                    </Flex>
                                }
                                {
                                    course.tags && course.tags.length > 0 && <Flex mt='4' alignItems='center' gap='2'>
                                        <Text fontSize='md' fontWeight='semibold'>Tags:</Text>
                                        {
                                            course.tags.map((tag, index) => <Badge key={index} colorScheme='green'>{tags.find((el) => el._id === tag).name}</Badge>)
                                        }
                                    </Flex>
                                }
                                {
                                    course.keywords && course.keywords.length > 0 && <Flex mt='4' alignItems='center' gap='2'>
                                        <Text fontSize='md' fontWeight='semibold'>Keywords:</Text>
                                        {
                                            course.keywords.map((keyword, index) => <Badge key={index} colorScheme='green'>{keyword}</Badge>)
                                        }
                                    </Flex>
                                }

                            </Box>
                        </ModalHeader>
                        <ModalCloseButton />

                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={onClose}>
                                Close
                            </Button>
                            <Button colorScheme='green' onClick={addImage}>
                                Save
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Admin>
        </>
    )
}

export default images;