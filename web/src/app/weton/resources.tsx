import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import React from 'react'

export default function Resources() {
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Title
                    </CardTitle>
                </CardHeader>
                <Separator />
                <CardFooter>
                    Footer
                </CardFooter>
            </Card>
        </div>
    )
}
