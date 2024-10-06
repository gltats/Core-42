/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strlcpy.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: tgomes-l <tgomes-l@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/12/14 08:14:50 by tgomes-l          #+#    #+#             */
/*   Updated: 2022/12/30 14:08:16 by tgomes-l         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

//copies up to dstsize - 1 characters from the string src to dst, 
//NUL-terminating the result if dstsize is not 0.

unsigned int	ft_strlcpy(char *dest, char *src, unsigned int size)
{
	unsigned int	i;

	i = 0;
	if (!size)
		return (ft_strlen(src));
	while (src[i] && (i < size - 1))
	{
		dest[i] = src[i];
		i++;
	}
	dest[i] = 0;
	return (ft_strlen(src));
}

// int main(void)
// {
// 	char str1[20] = "Hello";
// 	char str2[20];

// 	// copying str1 to str2
// 	ft_strlcpy(str2, str1, 3);
// 	puts(str2);

// 	return 0;	
// }