/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_isalnum.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: tgomes-l <tgomes-l@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/12/13 10:17:01 by tgomes-l          #+#    #+#             */
/*   Updated: 2022/12/17 20:57:56 by tgomes-l         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

//function tests for any character for which isalpha or isdigit is true. 

int	ft_isalnum(int x)
{
	if (ft_isalpha(x) || ft_isdigit(x))
		return (1);
	return (0);
}

//int	main()
//{
//	char c;
//
//	c = '2';
//	printf("Alphabet: %d", ft_isalnum(c));
//	return (0);
//}