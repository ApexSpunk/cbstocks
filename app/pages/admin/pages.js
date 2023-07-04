import { useState } from 'react';
import { Badge, Box, Button, Flex, Grid, GridItem, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Table, Tbody, Td, Text, Textarea, Th, Thead, Tr, useDisclosure, useToast } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import { FaAdjust, FaBookReader, FaEdit, FaHeading, FaListUl, FaMoneyBill, FaTimes, FaUser } from 'react-icons/fa';
import { Skeleton, SkeletonText } from '@chakra-ui/react';
import Admin from './index';
import { DeleteIcon } from '@chakra-ui/icons';
import dynamic from "next/dynamic";

const importJodit = () => import("jodit-react");

export async function getServerSideProps() {
    const res = await fetch('https://images.techrapid.in/page')
    const { pages } = await res.json()
    return {
        props: {
            data: pages
        }
    }
}

const JoditEditor = dynamic(importJodit, {
    ssr: false,
});


function pages({ data }) {
    const [loading, setLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [query, setQuery] = useState('add');
    const toast = useToast();
    var token = null;


    if (typeof window !== "undefined") {
        token = localStorage.getItem('token')
        if (!token) {
            window.location.href = '/'
        }
    }
    const [page, setPage] = useState({ title: '', slug: '', content: '', metaTitle: '', metaDescription: '', metaKeywords: '', status: '', search: '', subDomain: '' });
    const [pages, setPages] = useState(data);

    const addPage = async () => {
        setLoading(true);
        try {
            const res = await fetch('https://images.techrapid.in/page', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
                body: JSON.stringify(page),
            });
            console.log(res);
            const { page: data } = await res.json();
            setPages([...pages, data]);
            setLoading(false);
            onClose();
            toast({
                title: 'Page added.',
                description: "We've added the page for you.",
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const updatePage = async () => {
        setLoading(true);
        try {
            const res = await fetch(`https://images.techrapid.in/pages/${page._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
                body: JSON.stringify(page),
            });
            const { page: data } = await res.json();
            setPages(pages.map((item) => (item._id === data._id ? data : item)));
            setLoading(false);
            onClose();
            toast({
                title: 'Page updated.',
                description: "We've updated the page for you.",
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.log(error);
        }
    };




    return (
        <>
            <Admin>
                <Box bg="gray.50">
                    <Box mx="4">
                        <Grid templateColumns="repeat(7, 1fr)" gap={6}>
                            <GridItem colSpan={{ base: 7, md: 7 }} h="92vh" overflowY="scroll" pb="8" overflowX="hidden" css={{ '&::-webkit-scrollbar': { display: 'none' } }}>
                                <Box>
                                    <Box p="4" mt="4" borderRadius="lg" bg="white">
                                        <Flex alignItems="center" gap="2">
                                            <FaBookReader />
                                            <Text fontSize="2xl" fontWeight="semibold">Manage Pages</Text>
                                            <Button onClick={() => {
                                                onOpen();
                                                setPage({ title: '', slug: '', content: '', metaTitle: '', metaDescription: '', metaKeywords: '', status: '', search: '', subDomain: '' });
                                                setQuery('add');
                                            }} colorScheme="blue" size="md" ml="auto">Add Page</Button>
                                        </Flex>
                                    </Box>
                                    <Box mt="4">
                                        <Table variant="simple">
                                            <Thead>
                                                <Tr>
                                                    <Th>Page Title</Th>
                                                    <Th>
                                                        <Flex alignItems="center" justifyContent="flex-end">
                                                            <Text mr="2">Actions</Text>
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
                                                    pages.map((page, index) => (
                                                        <Tr key={index}>
                                                            <Td>{page?.title}</Td>
                                                            <Td>
                                                                <Button onClick={() => {
                                                                    onOpen();
                                                                    setPage(page);
                                                                    setQuery('update');
                                                                }} colorScheme="blue" size="sm" float="right" ml="2"><FaEdit /></Button>
                                                                <Button onClick={() => {
                                                                    setLoading(true);
                                                                    fetch(`https://images.techrapid.in/pages/${page._id}`, {
                                                                        method: 'DELETE',
                                                                        headers: {
                                                                            'Content-Type': 'application/json',
                                                                            'token': token
                                                                        },
                                                                    }).then(() => {
                                                                        setPages(pages.filter((item) => item._id !== page._id));
                                                                        setLoading(false);
                                                                        toast({
                                                                            title: 'Page deleted.',
                                                                            description: "We've deleted the page for you.",
                                                                            status: 'error',
                                                                            duration: 3000,
                                                                            isClosable: true,
                                                                        });
                                                                    });
                                                                }} colorScheme="red" size="sm" float="right" ml="2"><DeleteIcon /></Button>
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
                <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} size="3xl">
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>
                            <Text fontSize="xl" my="3" fontWeight="semibold">
                                {query === 'add' ? 'Add' : 'Update'} Page
                            </Text>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" children={<FaAdjust />} />
                                <Input type="text" placeholder="Page Name" value={page.title} onChange={(e) => setPage({ ...page, title: e.target.value })} />
                            </InputGroup>
                            <InputGroup mt="2">
                                <InputLeftElement pointerEvents="none" children={<FaAdjust />} />
                                <Input type="text" placeholder="Page Slug" value={page.slug} onChange={(e) => setPage({ ...page, slug: e.target.value })} />
                            </InputGroup>
                            <InputGroup mt="2">
                                <InputLeftElement pointerEvents="none" children={<FaAdjust />} />
                                <JoditEditor
                                    value={page.content}
                                    tabIndex={500}
                                    config={{ readonly: false }}
                                    onBlur={(newContent) => {
                                        setPage({ ...page, content: newContent });
                                    }}
                                    onChange={(newContent) => { }}
                                />
                            </InputGroup>
                            <InputGroup mt="2">
                                <InputLeftElement pointerEvents="none" children={<FaAdjust />} />
                                <Input type="text" placeholder="Page Meta Title" value={page.metaTitle} onChange={(e) => setPage({ ...page, metaTitle: e.target.value })} />
                            </InputGroup>
                            <InputGroup mt="2">
                                <InputLeftElement pointerEvents="none" children={<FaAdjust />} />
                                <Input type="text" placeholder="Page Meta Description" value={page.metaDescription} onChange={(e) => setPage({ ...page, metaDescription: e.target.value })} />
                            </InputGroup>
                            <InputGroup mt="2">
                                <InputLeftElement pointerEvents="none" children={<FaAdjust />} />
                                <Input type="text" placeholder="Page Meta Keywords" value={page.metaKeywords} onChange={(e) => setPage({ ...page, metaKeywords: e.target.value })} />
                            </InputGroup>
                            <InputGroup mt="2">
                                <InputLeftElement pointerEvents="none" children={<FaAdjust />} />
                                <Select placeholder="Page Status" value={page.status} onChange={(e) => setPage({ ...page, status: e.target.value })}>
                                    <option value="">Select Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </Select>
                            </InputGroup>
                            <InputGroup mt="2">
                                <InputLeftElement pointerEvents="none" children={<FaAdjust />} />
                                <Input type="text" placeholder="Page Search" value={page.search} onChange={(e) => setPage({ ...page, search: e.target.value })} />
                            </InputGroup>
                            <InputGroup mt="2">
                                <InputLeftElement pointerEvents="none" children={<FaAdjust />} />
                                <Input type="text" placeholder="Page Sub Domain" value={page.subDomain} onChange={(e) => setPage({ ...page, subDomain: e.target.value })} />
                            </InputGroup>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} onClick={onClose}>
                                Close
                            </Button>
                            <Button colorScheme="green" onClick={query === 'add' ? addPage : updatePage}>
                                {query === 'add' ? 'Add' : 'Update'}
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Admin>
        </>
    );
}

export default pages;
