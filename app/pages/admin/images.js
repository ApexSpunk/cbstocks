import { Badge, Box, Button, Flex, Grid, GridItem, Image, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, Textarea, useDisclosure, useToast } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { FaAdjust, FaBook, FaBookMedical, FaBookReader, FaBrain, FaClock, FaEdit, FaGift, FaHeading, FaHeadSideCough, FaHome, FaImage, FaListUl, FaMoneyBill, FaTiktok, FaTimes, FaUser, FaVideo, FaVideoSlash } from 'react-icons/fa'
import { Skeleton, SkeletonText } from '@chakra-ui/react'
import Admin from './index'
import { DeleteIcon } from '@chakra-ui/icons'


export async function getServerSideProps() {
    const res = await fetch('https://cb.techrapid.in/image')
    const { images } = await res.json()
    return {
        props: {
            images: images
        }
    }
}



function images({ images }) {
    const [loading, setLoading] = React.useState(false);
    const [data, setData] = React.useState(images);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [query, setQuery] = React.useState('update');
    const toast = useToast();

    const [course, setCourse] = React.useState({ title: '', description: '', slug: '', type: 'free', image: '', totalDuration: '', videos: [{ subtitle: '', duration: '', src: '' }] })

    const handleDelete = async (id) => {
        setLoading(true)
        const res = fetch(`http://65.20.70.117:8000/image/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
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
        getImages()
    }

    const getImages = async () => {
        setLoading(true)
        const res = await fetch('http://65.20.70.117:8000/image')
        const { images } = await res.json()
        setData(images)
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
                                                setCourse({ title: '', description: '', slug: '', type: 'free', image: '', totalDuration: '', videos: [{ subtitle: '', duration: '', src: '' }] })
                                                setQuery('add')
                                            }} colorScheme='blue' size='md' ml='auto'>Add Image</Button>
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
                                            </GridItem>) : data?.map((course, index) =>
                                                <GridItem colSpan={1} key={index} >
                                                    <Box borderRadius='lg' boxShadow={'md'} bg='white'>
                                                        <Image src={course.path} roundedTop={'lg'} h={'180px'} w='100%' objectFit='cover' />
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
                                                            <Text fontSize='sm' fontWeight='semibold' color='gray.500'>{course.category}</Text>

                                                            <Flex alignItems='center' mt='4'>
                                                                <Button colorScheme='blue' w='full' leftIcon={<FaEdit />} onClick={() => {
                                                                    setCourse(course);
                                                                    onOpen();
                                                                    setQuery('update')
                                                                }}>
                                                                    Edit
                                                                </Button>
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
                                </Box>
                            </GridItem>
                        </Grid>
                    </Box>
                </Box>
                <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} size='5xl'>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>
                            <Text fontSize='xl' my='3' fontWeight='semibold'>
                                Preview & {query === 'add' ? 'Add' : 'Update'} Image
                            </Text>
                            <Flex alignItems='center' gap='2'>
                                <GridItem colSpan={1} w='50%'>
                                    <Box borderRadius='lg' boxShadow={'md'} bg='white'>
                                        <Image src={course.image || "https://img.freepik.com/premium-vector/online-courses-concept_23-2148524391.jpg?w=2000"} roundedTop={'lg'} />
                                        <Box p='4'>
                                            <Badge colorScheme={course.type === 'free' ? 'green' : 'orange'} mb='2'>
                                                {course.type} Course
                                            </Badge>
                                            <Text fontSize='md' fontWeight='semibold'>{course.title}</Text>
                                            <Text mt='2' fontSize='sm' textColor='gray.500'>Learn {
                                                course.title?.split('to')[1]?.length > 10 ? `${course.title.split('to')[1].slice(0, 10)}... ` : course.title.split('to')[1]
                                            } from scratch</Text>
                                            <Text mt='2' fontSize='sm' textColor='gray.500'>Duration: <Badge colorScheme='green' ml='2'>{
                                                course.totalDuration
                                            } Mins</Badge></Text>
                                        </Box>
                                    </Box>
                                </GridItem>
                                <Box w='50%'>
                                    <InputGroup>
                                        <InputLeftElement pointerEvents='none' children={<FaAdjust />} />
                                        <Input type='text' placeholder='Course Title' value={course.title} onChange={(e) => setCourse({ ...course, title: e.target.value })} />
                                    </InputGroup>
                                    <InputGroup mt='4'>
                                        <Textarea type='text' placeholder='Course Description' value={course.description} onChange={(e) => setCourse({ ...course, description: e.target.value })} />
                                    </InputGroup>
                                    <InputGroup mt='4'>
                                        <InputLeftElement pointerEvents='none' children={<FaListUl />} />
                                        <Input type='text' placeholder='Course Slug' value={course.slug} onChange={(e) => setCourse({ ...course, slug: e.target.value })} />
                                    </InputGroup>
                                    <InputGroup mt='4'>
                                        <Select value={course.type} onChange={(e) => setCourse({ ...course, type: e.target.value })}>
                                            <option value='free'>Free</option>
                                            <option value='paid'>Paid</option>
                                        </Select>
                                    </InputGroup>
                                    <InputGroup mt='4'>
                                        <InputLeftElement pointerEvents='none' children={<FaImage />} />
                                        <Input type='text' placeholder='Course Image' value={course.image} onChange={(e) => setCourse({ ...course, image: e.target.value })} />
                                    </InputGroup>
                                    <InputGroup mt='4'>
                                        <InputLeftElement pointerEvents='none' children={<FaClock />} />
                                        <Input type='text' placeholder='Course Duration' value={course.totalDuration} onChange={(e) => setCourse({ ...course, totalDuration: e.target.value })} />
                                    </InputGroup>
                                </Box>
                            </Flex>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Grid templateColumns='repeat(2, 1fr)' gap={6}>
                                {
                                    course?.videos?.map((video, index) => (
                                        <Box key={index} mt='4'>
                                            <InputGroup>
                                                <InputLeftElement pointerEvents='none' children={<FaVideo />} />
                                                <Input type='text' placeholder={`Video Title ${index + 1}`} value={video.subtitle} onChange={(e) => {
                                                    const newVideos = course.videos;
                                                    newVideos[index].subtitle = e.target.value;
                                                    setCourse({ ...course, videos: newVideos });
                                                }
                                                } />
                                            </InputGroup>
                                            <InputGroup mt='4'>
                                                <InputLeftElement pointerEvents='none' children={<FaClock />} />
                                                <Input type='text' placeholder={`Video Duration ${index + 1}`} value={video.duration} onChange={(e) => {
                                                    const newVideos = course.videos;
                                                    newVideos[index].duration = e.target.value;
                                                    setCourse({ ...course, videos: newVideos });
                                                }
                                                } />
                                            </InputGroup>
                                            <InputGroup mt='4'>
                                                <InputLeftElement pointerEvents='none' children={<FaVideoSlash />} />
                                                <Input type='text' placeholder={`Video URL ${index + 1}`} value={video.src} onChange={(e) => {
                                                    const newVideos = course.videos;
                                                    newVideos[index].src = e.target.value;
                                                    setCourse({ ...course, videos: newVideos });
                                                }
                                                } />
                                            </InputGroup>
                                        </Box>
                                    ))
                                }
                            </Grid>
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme='green' mr={3} onClick={() => {
                                const newVideos = course.videos;
                                newVideos.push({ subtitle: '', duration: '', src: '' });
                                setCourse({ ...course, videos: newVideos });
                            }}>
                                Add Video
                            </Button>
                            <Button colorScheme='blue' mr={3} onClick={onClose}>
                                Close
                            </Button>
                            <Button colorScheme={course.type === 'free' ? 'green' : 'orange'} onClick={() => {
                                console.log('course');
                                if (query === 'add') {
                                    dispatch(addCourse(course));
                                    toast({ title: `Course ${course.title} added`, status: 'success', duration: 3000, isClosable: true, position: 'top' });
                                }
                                if (query === 'update') {
                                    dispatch(updateCourse(course));
                                    toast({ title: `Course ${course.title} added`, status: 'success', duration: 3000, isClosable: true, position: 'top' });
                                }
                                onClose();
                            }}>
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