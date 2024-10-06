/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strchr.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gltats <gltats@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/12/14 08:22:49 by tgomes-l          #+#    #+#             */
/*   Updated: 2023/02/25 15:39:45 by gltats           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

char	*ft_strchr(char *s, int c)
{
	unsigned char	ch;

	ch = c;
	while (*s)
	{
		if ((char)*s == ch)
			return ((char *)s);
		s++;
	}
	if (ch == '\0')
		return ((char *)s);
	return (0);
}

// int	main()
// {
// 	char	str[] = "teste";
// 	printf("%s\n", ft_strchr(str, 1024));
// 	printf("%s\n", strchr(str, 1024));
// }