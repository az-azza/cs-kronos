import styles from './KRepoCard.module.css';

import { useRef, useState } from 'react';

import {
  Text,
  Box,
  Card,
  Flex,
  Avatar,
  Skeleton,
  Button,
} from '@radix-ui/themes';

import { tv } from 'tailwind-variants';

import { TRepoItem } from '@kronos/types';

export const KRepoCard = ({
  item,
  stargazersMinMax,
}: {
  item: TRepoItem;
  stargazersMinMax?: any;
}) => {
  //const imgRef = useRef<HTMLImageElement>(null);

  const heat = tv({
    base: 'font-small active:opacity-60 p-2 hover:opacity-80 ',
    variants: {
      // color: {
      //   primary: '',
      //   secondary: 'bg-purple-500',
      // },
      // temp: {
      //   mellow: 'bg-green-500',
      //   hot: '',
      // },
    },
    compoundVariants: [
      // {
      //   size: ['sm', 'md'],
      //   class: 'px-3 py-1'
      // }
    ],
    defaultVariants: {
      // temp: 'mellow',
      // color: 'primary',
    },
  });

  // const calcGradient = (minMax, count )=>{
  //   return Math.round(((minMax.max - minMax.min)/count)*1)*100;
  // };

  const gradient = ''; //`bg-red-${calcGradient(stargazersMinMax,item.stargazers_count)}`;

  // //console.log(gradient);

  return (
    <Box maxWidth="100%">
      <Card>
        <Flex gap="3" align="center">
          <Avatar
            size="3"
            key={item.id + '_1'}
            src={item?.owner?.avatar_url}
            radius="full"
            fallback="T"
          />
          <Box>
            <Text
              //className={heat({ temp: 'hot' })+' '+gradient}
              as="div"
              size="2"
              weight="bold"
            >
              gazing: {item.stargazers_count}
            </Text>
          </Box>
          <Box>
            <Text as="div" size="2" weight="bold">
              {item.name}
            </Text>
            <Text as="div" size="2" color="gray">
              {item.description}
            </Text>
          </Box>
          <Box>
            <Button>
              <a href={`${item.html_url}`} target="_blank">
                More
              </a>
            </Button>
          </Box>
        </Flex>
      </Card>
    </Box>
  );
};

export default KRepoCard;
