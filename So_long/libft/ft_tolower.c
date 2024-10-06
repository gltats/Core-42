/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_tolower.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: tgomes-l <tgomes-l@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/12/14 08:22:52 by tgomes-l          #+#    #+#             */
/*   Updated: 2022/12/30 19:09:40 by tgomes-l         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

static int	ft_islowercase(int c)
{
	if (c >= 65 && c <= 90)
		return (1);
	return (0);
}

int	ft_tolower(int c)
{
	if (ft_islowercase(c))
	{
		c += 32;
		return (c);
	}
	return (c);
}

// int main(void) 
// {
//   char ch = ft_tolower('M');

//   printf("%c", ch);
//   return (0);
// }