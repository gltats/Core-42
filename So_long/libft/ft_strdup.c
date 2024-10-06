/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strdup.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: tgomes-l <tgomes-l@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/12/18 16:40:42 by tgomes-l          #+#    #+#             */
/*   Updated: 2022/12/31 19:36:16 by tgomes-l         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

// The strdup() function allocates sufficient memory for a copy 
// of the string s1, does the copy, and returns a pointer to it.  
// The pointer may subsequently be used as an argument to the function free(3).
// If insufficient memory is available, NULL is returned.
// The strndup() function copies at most n characters from the string s1 always 
// NUL terminating the copied string.

char	*ft_strdup(char *s1)
{
	char	*dest;
	size_t	i;

	i = 0;
	i = ft_strlen(s1) + 1;
	dest = (char *)malloc(sizeof(char) * i);
	if (!dest)
		return (0);
	i = 0;
	while (s1[i])
	{
		dest[i] = s1[i];
		i++;
	}
	dest[i] = '\0';
	return (dest);
}

// int main()
// {
//     char *source = "Hello World";
//     char* dest = ft_strdup(source);
//     printf("Destination -> %s\n", dest);
// 	printf("Destination -> %s\n", ft_strdup("Hello World"));
//     return 0;
// }	