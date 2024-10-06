/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_calloc.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: tgomes-l <tgomes-l@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/12/18 16:06:16 by tgomes-l          #+#    #+#             */
/*   Updated: 2022/12/21 20:28:05 by tgomes-l         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

//The calloc() function contiguously allocates enough space 
//for count objects that are size bytes of memory each and
//returns a pointer to the allocated memory.  
//The allocated memory is filled with bytes of value zero.
void	*ft_calloc(size_t count, size_t size)
{
	void	*ptr;

	ptr = malloc (count * size);
	if (!ptr)
	{
		return (0);
	}
	ft_bzero (ptr, count * size);
	return (ptr);
}
